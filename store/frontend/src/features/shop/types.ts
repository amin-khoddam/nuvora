export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const SORT_OPTIONS = ["featured", "newest", "priceAsc", "priceDesc", "rating"] as const;
export type ProductSort = (typeof SORT_OPTIONS)[number];
export const DEFAULT_SORT: ProductSort = "featured";

export function isCurrencyCode(value: string): value is CurrencyCode {
    return (CURRENCIES as readonly string[]).includes(value);
}

export function isProductSort(value: string): value is ProductSort {
    return (SORT_OPTIONS as readonly string[]).includes(value);
}

export type ProductCollection = "featured" | "new-arrivals";

export interface Category {
    id: string;
    slug: string;
    name: string;
    image: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    image: string;
    /** Already expressed in `currency`. */
    price: number;
    compareAtPrice: number | null;
    discountPercent: number | null;
    currency: CurrencyCode;
    rating: number;
    reviewCount: number;
    categoryId: string;
    /** ISO 8601 */
    createdAt: string;
}

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export interface ProductSpec {
    label: string;
    value: string;
}

export interface ProductDetail extends Product {
    description: string;
    /** Ordered image URLs; the first one is shown initially. */
    gallery: string[];
    highlights: string[];
    specs: ProductSpec[];
    stockStatus: StockStatus;
}

export interface HeroSlide {
    id: string;
    badge: string;
    title: string;
    /** May contain `\n` for a manual line break. */
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
}

export interface ApiListResponse<T> {
    data: T[];
    meta: { total: number };
}

export interface ApiItemResponse<T> {
    data: T;
}

export interface ProductsQuery {
    collection: ProductCollection;
    sort: ProductSort;
    /** Category id, or null for all categories. */
    category: string | null;
    currency: CurrencyCode;
    limit?: number;
}