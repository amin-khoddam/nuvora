import { MOCK_CATEGORIES, MOCK_HERO_SLIDES, MOCK_PRODUCTS } from "./mock-data";
import type {
    ApiListResponse,
    Category,
    CurrencyCode,
    HeroSlide,
    Product,
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

function list<T>(items: T[]): ApiListResponse<T> {
    return { data: items, meta: { total: items.length } };
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
        .map((product) => ({
            ...product,
            currency,
            price: convert(product.price, currency),
            compareAtPrice: product.compareAtPrice === null ? null : convert(product.compareAtPrice, currency),
        }));

    const total = matches.length;
    return { data: limit ? matches.slice(0, limit) : matches, meta: { total } };
}