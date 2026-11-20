export const CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

export const SORT_OPTIONS = ["featured", "newest", "priceAsc", "priceDesc", "rating"] as const;
export type ProductSort = (typeof SORT_OPTIONS)[number];
export const DEFAULT_SORT: ProductSort = "featured";

export const CATALOG_PAGE_SIZE = 12;

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
    from: number;
    to: number;
}

/** `?price=100-500` */
export interface RangeFilter extends FilterBase {
    type: "range";
    min: number;
    max: number;
    step: number;
    /**
     * `currency`: bounds are money already expressed in the requested currency,
     * and the UI formats them with it. `number`: plain numbers shown with `unit`.
     */
    valueType: "currency" | "number";
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

/** Price and stock live on the color, in the product's currency. */
export interface ProductColor {
    id: string;
    name: string;
    /** CSS color, e.g. `#1c1c1e`. */
    hex: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
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

/* --------------------------------- API ---------------------------------- */

export interface ApiListResponse<T> {
    data: T[];
    meta: { total: number };
}

export interface ApiPagedResponse<T> {
    data: T[];
    meta: { total: number; page: number; pageSize: number; totalPages: number };
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

/** Product listing: category page and search. The page number is passed separately. */
export interface CatalogQuery {
    /** Slug chain joined with "/", e.g. `smartphone/apple`; null for all products. */
    category: string | null;
    q: string | null;
    sort: ProductSort;
    currency: CurrencyCode;
    /** Filter key → selected values (a range is one `from-to` string). */
    filters: Record<string, string[]>;
    pageSize: number;
}

export interface CategorySuggestion {
    id: string;
    name: string;
    /** Slug chain from the root, used to build the URL. */
    path: string[];
    /** Names of the ancestors, for context in the dropdown. */
    trail: string[];
}

export interface SearchSuggestions {
    categories: CategorySuggestion[];
    products: Product[];
}