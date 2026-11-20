import { ApiError } from "@/lib/api/errors";
import { MOCK_CATEGORIES } from "./mock-categories";
import { MOCK_HERO_SLIDES, MOCK_PRODUCTS } from "./mock-data";
import { MOCK_PRODUCT_DETAILS } from "./mock-product-details";
import { MOCK_PRODUCT_SELLERS } from "./mock-product-variants";
import type {
    ApiItemResponse,
    ApiListResponse,
    Category,
    CurrencyCode,
    HeroSlide,
    Product,
    ProductDetail,
    ProductSeller,
    ProductSort,
    ProductsQuery,
    VariantOffer,
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

function localizeOffer<T extends VariantOffer>(variantOffer: T, currency: CurrencyCode): T {
    return {
        ...variantOffer,
        price: convert(variantOffer.price, currency),
        compareAtPrice: variantOffer.compareAtPrice === null ? null : convert(variantOffer.compareAtPrice, currency),
    };
}

function localizeSeller(seller: ProductSeller, currency: CurrencyCode): ProductSeller {
    return {
        ...seller,
        colors: seller.colors.map((color) => ({
            ...color,
            offer: color.offer ? localizeOffer(color.offer, currency) : null,
            sizes: color.sizes.map((size) => localizeOffer(size, currency)),
        })),
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

/** One seller, one color, no sizes. */
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
                    offer: { price: product.price, compareAtPrice: product.compareAtPrice, stock: 20 },
                    sizes: [],
                },
            ],
        },
    ];
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
    const sellers = (MOCK_PRODUCT_SELLERS[product.id] ?? buildFallbackSellers(product)).map((seller) =>
        localizeSeller(seller, currency),
    );

    return { data: { ...localize(product, currency), ...extras, sellers } };
}