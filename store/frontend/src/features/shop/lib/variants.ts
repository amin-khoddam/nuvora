import type { ProductColor, ProductSeller, StockStatus } from "../types";

const LOW_STOCK_THRESHOLD = 5;

export interface VariantChoice {
    sellerId: string | null;
    colorId: string | null;
}

export interface ResolvedVariant {
    seller: ProductSeller | null;
    color: ProductColor | null;
    /** Stable identifier of the combination, used as part of the cart key. */
    key: string;
}

export function isColorInStock(color: ProductColor): boolean {
    return color.stock > 0;
}

export function isSellerInStock(seller: ProductSeller): boolean {
    return seller.colors.some(isColorInStock);
}

export function getSellerStartingPrice(seller: ProductSeller): number | null {
    const prices = seller.colors.filter(isColorInStock).map((color) => color.price);
    return prices.length > 0 ? Math.min(...prices) : null;
}

/** The chosen item when still available, otherwise the first available one. */
function pick<T extends { id: string }>(
    items: readonly T[],
    id: string | null,
    isAvailable: (item: T) => boolean,
): T | null {
    return items.find((item) => item.id === id && isAvailable(item)) ?? items.find(isAvailable) ?? items[0] ?? null;
}

/**
 * Seller → Color → Price. A color that does not exist under the newly chosen
 * seller silently falls back, so the result is always a valid combination.
 */
export function resolveVariant(sellers: readonly ProductSeller[], choice: VariantChoice): ResolvedVariant {
    const seller = pick(sellers, choice.sellerId, isSellerInStock);
    const color = seller ? pick(seller.colors, choice.colorId, isColorInStock) : null;
    const key = [seller?.id, color?.id].filter(Boolean).join(":");

    return { seller, color, key };
}

export function getStockStatus(stock: number): StockStatus {
    if (stock <= 0) return "outOfStock";
    return stock <= LOW_STOCK_THRESHOLD ? "lowStock" : "inStock";
}

export function getDiscountPercent(price: number, compareAtPrice: number | null): number | null {
    if (compareAtPrice === null || compareAtPrice <= price) return null;
    return Math.round((1 - price / compareAtPrice) * 100);
}