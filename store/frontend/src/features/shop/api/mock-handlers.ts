import { ApiError } from "@/lib/api/errors";
import { collectCategoryIds, resolvePathBySlugs } from "../lib/category-tree";
import { parseRangeValue } from "../lib/filter-query";
import { MOCK_CATALOG } from "./mock-catalog";
import { MOCK_CATEGORIES } from "./mock-categories";
import { MOCK_HERO_SLIDES, MOCK_PRODUCTS } from "./mock-data";
import { MOCK_PRODUCT_DETAILS } from "./mock-product-details";
import { MOCK_PRODUCT_SELLERS } from "./mock-product-variants";
import type {
    ApiItemResponse,
    ApiListResponse,
    ApiPagedResponse,
    CatalogQuery,
    Category,
    CategoryFilter,
    CategorySuggestion,
    CurrencyCode,
    HeroSlide,
    Product,
    ProductDetail,
    ProductSeller,
    ProductSort,
    ProductsQuery,
    SearchSuggestions,
} from "../types";

/** Stand-in for what the backend does when asked for prices in another currency. */
const EXCHANGE_RATES = { USD: 1, EUR: 0.92, GBP: 0.79 } as const satisfies Record<CurrencyCode, number>;

const COMPARATORS: Record<ProductSort, (a: Product, b: Product) => number> = {
    featured: () => 0,
    newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
};

type DetailExtras = Pick<ProductDetail, "description" | "gallery" | "highlights" | "specs">;

function convert(usdAmount: number, currency: CurrencyCode): number {
    return Math.round(usdAmount * EXCHANGE_RATES[currency] * 100) / 100;
}

function localize(product: Product, currency: CurrencyCode): Product {
    return {
        ...product,
        currency,
        price: convert(product.price, currency),
        compareAtPrice: product.compareAtPrice === null ? null : convert(product.compareAtPrice, currency),
    };
}

function localizeSeller(seller: ProductSeller, currency: CurrencyCode): ProductSeller {
    return {
        ...seller,
        colors: seller.colors.map((color) => ({
            ...color,
            price: convert(color.price, currency),
            compareAtPrice: color.compareAtPrice === null ? null : convert(color.compareAtPrice, currency),
        })),
    };
}

/** Price filter bounds follow the requested currency, rounded to tidy numbers. */
function localizeFilter(filter: CategoryFilter, currency: CurrencyCode): CategoryFilter {
    if (filter.type !== "range" || filter.valueType !== "currency") return filter;

    const scale = (amount: number) => Math.round((amount * EXCHANGE_RATES[currency]) / 10) * 10;
    return {
        ...filter,
        min: scale(filter.min),
        max: scale(filter.max),
        presets: filter.presets.map((preset) => ({ from: scale(preset.from), to: scale(preset.to) })),
    };
}

function localizeCategory(category: Category, currency: CurrencyCode): Category {
    return {
        ...category,
        filters: category.filters.map((filter) => localizeFilter(filter, currency)),
        children: category.children.map((child) => localizeCategory(child, currency)),
    };
}

function list<T>(items: T[]): ApiListResponse<T> {
    return { data: items, meta: { total: items.length } };
}

/** Detail-only fields for products that have no hand-written entry in `mock-product-details`. */
function buildFallbackDetails(product: Product): DetailExtras {
    return {
        description: `${product.name} from our latest tech collection, with a 1-year warranty and free returns.`,
        gallery: ["Front", "Side", "Back"].map(
            (view) => `https://placehold.co/800x800/png?text=${encodeURIComponent(`${product.name} ${view}`)}`,
        ),
        highlights: ["1-year warranty", "Free shipping", "30-day returns"],
        specs: [
            { label: "Warranty", value: "1 year" },
            { label: "Returns", value: "30 days" },
        ],
    };
}

/** One seller, one color. */
function buildFallbackSellers(product: Product): ProductSeller[] {
    return [
        {
            id: "nuvora",
            name: "Nuvora Official",
            rating: 4.9,
            colors: [
                {
                    id: "default",
                    name: "Default",
                    hex: "#52525b",
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    stock: 20,
                },
            ],
        },
    ];
}

export function getMockCategories(currency: CurrencyCode): ApiListResponse<Category> {
    return list(MOCK_CATEGORIES.map((category) => localizeCategory(category, currency)));
}

export function getMockHeroSlides(): ApiListResponse<HeroSlide> {
    return list(MOCK_HERO_SLIDES);
}

export function getMockProducts(query: ProductsQuery): ApiListResponse<Product> {
    const { collection, sort, category, currency, limit } = query;

    const matches = MOCK_PRODUCTS[collection]
        .filter((product) => category === null || product.categoryId === category)
        .sort(COMPARATORS[sort])
        .map((product) => localize(product, currency));

    const total = matches.length;
    return { data: limit ? matches.slice(0, limit) : matches, meta: { total } };
}

/** Category (with descendants), search term, filters, sort and paging, like the real endpoint. */
export function getMockCatalog(query: CatalogQuery, page: number): ApiPagedResponse<Product> {
    const { category, q, sort, currency, filters, pageSize } = query;

    let allowedCategoryIds: Set<string> | null = null;
    if (category) {
        const node = resolvePathBySlugs(MOCK_CATEGORIES, category.split("/"))?.at(-1);
        allowedCategoryIds = new Set(node ? collectCategoryIds(node) : []);
    }
    const term = q?.trim().toLowerCase();

    const matches = MOCK_CATALOG.map((entry) => ({ ...entry, product: localize(entry.product, currency) }))
        .filter(({ product, attributes }) => {
            if (allowedCategoryIds && !allowedCategoryIds.has(product.categoryId)) return false;
            if (term && !`${product.name} ${attributes.brand ?? ""}`.toLowerCase().includes(term)) return false;

            return Object.entries(filters).every(([key, values]) => {
                if (key === "price") {
                    const range = parseRangeValue(values[0]);
                    return !range || (product.price >= range.from && product.price <= range.to);
                }
                const value = attributes[key];
                return value !== undefined && values.includes(value);
            });
        })
        .map((entry) => entry.product)
        .sort(COMPARATORS[sort]);

    const total = matches.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    return { data: matches.slice(start, start + pageSize), meta: { total, page, pageSize, totalPages } };
}

function collectCategorySuggestions(
    nodes: Category[],
    slugs: string[],
    names: string[],
    needle: string,
): CategorySuggestion[] {
    return nodes.flatMap((node) => {
        const path = [...slugs, node.slug];
        const own = node.name.toLowerCase().includes(needle)
            ? [{ id: node.id, name: node.name, path, trail: names }]
            : [];
        return [...own, ...collectCategorySuggestions(node.children, path, [...names, node.name], needle)];
    });
}

export function getMockSuggestions(term: string, currency: CurrencyCode): ApiItemResponse<SearchSuggestions> {
    const needle = term.trim().toLowerCase();

    const categories = collectCategorySuggestions(MOCK_CATEGORIES, [], [], needle).slice(0, 4);
    const products = MOCK_CATALOG.filter(({ product, attributes }) =>
        `${product.name} ${attributes.brand ?? ""}`.toLowerCase().includes(needle),
    )
        .slice(0, 5)
        .map(({ product }) => localize(product, currency));

    return { data: { categories, products } };
}

const ALL_MOCK_PRODUCTS = [...Object.values(MOCK_PRODUCTS).flat(), ...MOCK_CATALOG.map((entry) => entry.product)];

/** Throws the same `ApiError` a real 404 would produce after the response interceptor. */
export function getMockProduct(slug: string, currency: CurrencyCode): ApiItemResponse<ProductDetail> {
    const product = ALL_MOCK_PRODUCTS.find((item) => item.slug === slug);
    if (!product) throw new ApiError("Product not found", "client", 404);

    const extras = MOCK_PRODUCT_DETAILS[product.id] ?? buildFallbackDetails(product);
    const sellers = (MOCK_PRODUCT_SELLERS[product.id] ?? buildFallbackSellers(product)).map((seller) =>
        localizeSeller(seller, currency),
    );

    return { data: { ...localize(product, currency), ...extras, sellers } };
}