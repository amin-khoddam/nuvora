import type { ProductColor, ProductSeller, ProductSize, StockStatus, VariantOffer } from "../types";

const LOW_STOCK_THRESHOLD = 5;

export interface VariantChoice {
    sellerId: string | null;
    colorId: string | null;
    sizeId: string | null;
}

export interface ResolvedVariant {
    seller: ProductSeller | null;
    color: ProductColor | null;
    size: ProductSize | null;
    /** Price and stock of the resolved combination (size, or color when it has no sizes). */
    offer: VariantOffer | null;
    /** Stable identifier of the combination, used as part of the cart key. */
    key: string;
}

/** Offers at the deepest level of a color: its sizes, or the color itself. */
export function getColorOffers(color: ProductColor): VariantOffer[] {
    if (color.sizes.length > 0) return color.sizes;
    return color.offer ? [color.offer] : [];
}

export function isColorInStock(color: ProductColor): boolean {
    return getColorOffers(color).some((offer) => offer.stock > 0);
}

export function isSellerInStock(seller: ProductSeller): boolean {
    return seller.colors.some(isColorInStock);
}

export function getSellerStartingPrice(seller: ProductSeller): number | null {
    const prices = seller.colors
        .flatMap(getColorOffers)
        .filter((offer) => offer.stock > 0)
        .map((offer) => offer.price);

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
 * Seller → Color → Size → Offer. A choice that no longer exists under the new
 * parent (e.g. a size after switching color) silently falls back, so the
 * result is always a valid combination.
 */
export function resolveVariant(sellers: readonly ProductSeller[], choice: VariantChoice): ResolvedVariant {
    const seller = pick(sellers, choice.sellerId, isSellerInStock);
    const color = seller ? pick(seller.colors, choice.colorId, isColorInStock) : null;
    const size = color && color.sizes.length > 0 ? pick(color.sizes, choice.sizeId, (item) => item.stock > 0) : null;
    const offer = size ?? color?.offer ?? null;
    const key = [seller?.id, color?.id, size?.id].filter(Boolean).join(":");

    return { seller, color, size, offer, key };
}

export function getStockStatus(stock: number): StockStatus {
    if (stock <= 0) return "outOfStock";
    return stock <= LOW_STOCK_THRESHOLD ? "lowStock" : "inStock";
}

export function getDiscountPercent(price: number, compareAtPrice: number | null): number | null {
    if (compareAtPrice === null || compareAtPrice <= price) return null;
    return Math.round((1 - price / compareAtPrice) * 100);
}