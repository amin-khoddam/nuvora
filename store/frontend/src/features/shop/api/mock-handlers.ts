import { ApiError } from "@/lib/api/errors";
import { MOCK_CATEGORIES, MOCK_HERO_SLIDES, MOCK_PRODUCTS } from "./mock-data";
import { MOCK_PRODUCT_DETAILS } from "./mock-product-details";
import type {
    ApiItemResponse,
    ApiListResponse,
    Category,
    CurrencyCode,
    HeroSlide,
    Product,
    ProductDetail,
    ProductSort,
    ProductsQuery,
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

function list<T>(items: T[]): ApiListResponse<T> {
    return { data: items, meta: { total: items.length } };
}

/** Detail-only fields for products that have no hand-written entry in `mock-product-details`. */
function buildFallbackDetails(product: Product): Omit<ProductDetail, keyof Product> {
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
        stockStatus: "inStock",
    };
}

export function getMockCategories(): ApiListResponse<Category> {
    return list(MOCK_CATEGORIES);
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

const ALL_MOCK_PRODUCTS = Object.values(MOCK_PRODUCTS).flat();

/** Throws the same `ApiError` a real 404 would produce after the response interceptor. */
export function getMockProduct(slug: string, currency: CurrencyCode): ApiItemResponse<ProductDetail> {
    const product = ALL_MOCK_PRODUCTS.find((item) => item.slug === slug);
    if (!product) throw new ApiError("Product not found", "client", 404);

    const extras = MOCK_PRODUCT_DETAILS[product.id] ?? buildFallbackDetails(product);
    return { data: { ...localize(product, currency), ...extras } };
}