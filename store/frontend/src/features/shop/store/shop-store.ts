import { create } from "zustand";
import {
    DEFAULT_CURRENCY,
    DEFAULT_SORT,
    type CurrencyCode,
    type ProductSort,
} from "../types";

export interface ShopState {
    sort: ProductSort;
    /** Category id, or null for all categories. */
    categoryId: string | null;
    currency: CurrencyCode;
    wishlist: string[];
    /** Product id → quantity. */
    cart: Record<string, number>;
    setSort: (sort: ProductSort) => void;
    setCategoryId: (categoryId: string | null) => void;
    setCurrency: (currency: CurrencyCode) => void;
    toggleWishlist: (productId: string) => void;
    addToCart: (productId: string) => void;
}

export const useShopStore = create<ShopState>()((set) => ({
    sort: DEFAULT_SORT,
    categoryId: null,
    currency: DEFAULT_CURRENCY,
    wishlist: [],
    cart: {},
    setSort: (sort) => set({ sort }),
    setCategoryId: (categoryId) => set({ categoryId }),
    setCurrency: (currency) => set({ currency }),
    toggleWishlist: (productId) =>
        set((state) => ({
            wishlist: state.wishlist.includes(productId)
                ? state.wishlist.filter((id) => id !== productId)
                : [...state.wishlist, productId],
        })),
    addToCart: (productId) =>
        set((state) => ({ cart: { ...state.cart, [productId]: (state.cart[productId] ?? 0) + 1 } })),
}));

export const selectCartCount = (state: ShopState) =>
    Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);