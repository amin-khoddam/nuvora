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

/* ------------------------------ Categories ------------------------------ */

export interface FilterOption {
    value: string;
    label: string;
}

interface FilterBase {
    /** Query-string parameter name, e.g. `brand`. */
    key: string;
    label: string;
}

/** One value: `?year=2026` */
export interface SelectFilter extends FilterBase {
    type: "select";
    options: FilterOption[];
}

/** Many values, repeated parameter: `?brand=samsung&brand=apple` */
export interface MultiSelectFilter extends FilterBase {
    type: "multiselect";
    options: FilterOption[];
}

export interface RangePreset {
    label: string;
    from: number;
    to: number;
}

/** `?price=100-500` */
export interface RangeFilter extends FilterBase {
    type: "range";
    min: number;
    max: number;
    step: number;
    unit: string | null;
    presets: RangePreset[];
}

export type CategoryFilter = SelectFilter | MultiSelectFilter | RangeFilter;

export interface Category {
    id: string;
    /** One URL segment. The full URL is the chain of slugs from the root. */
    slug: string;
    name: string;
    image: string | null;
    /** Own filters. Empty means "inherit the nearest ancestor's filters". */
    filters: CategoryFilter[];
    /** Unlimited depth. */
    children: Category[];
}

/* -------------------------------- Products ------------------------------- */

export interface Product {
    id: string;
    slug: string;
    name: string;
    image: string;
    /** Lowest price; already expressed in `currency`. */
    price: number;
    compareAtPrice: number | null;
    discountPercent: number | null;
    currency: CurrencyCode;
    rating: number;
    reviewCount: number;
    /** Deepest category the product belongs to. */
    categoryId: string;
    /** ISO 8601 */
    createdAt: string;
}

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export interface ProductSpec {
    label: string;
    value: string;
}

/** Price and stock of one purchasable combination, in the product's currency. */
export interface VariantOffer {
    price: number;
    compareAtPrice: number | null;
    stock: number;
}

export interface ProductSize extends VariantOffer {
    id: string;
    label: string;
}

export interface ProductColor {
    id: string;
    name: string;
    /** CSS color, e.g. `#1c1c1e`. */
    hex: string;
    /** Used only when the color has no sizes. */
    offer: VariantOffer | null;
    /** Empty when this color is not sold in sizes. */
    sizes: ProductSize[];
}

export interface ProductSeller {
    id: string;
    name: string;
    rating: number | null;
    /** Every seller has at least one color. */
    colors: ProductColor[];
}

export interface ProductDetail extends Product {
    description: string;
    /** Ordered image URLs; the first one is shown initially. */
    gallery: string[];
    highlights: string[];
    specs: ProductSpec[];
    sellers: ProductSeller[];
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