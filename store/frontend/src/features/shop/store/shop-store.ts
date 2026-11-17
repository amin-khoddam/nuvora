import { create } from "zustand";
import {
    DEFAULT_CURRENCY,
    DEFAULT_SORT,
    type CurrencyCode,
    type ProductSort,
} from "../types";

export const MAX_CART_QUANTITY = 10;

export interface ShopState {
    sort: ProductSort;
    /** Category id, or null for all categories. */
    categoryId: string | null;
    currency: CurrencyCode;
    wishlist: string[];
    /** Product id → quantity. Products that are not in the cart have no entry. */
    cart: Record<string, number>;
    setSort: (sort: ProductSort) => void;
    setCategoryId: (categoryId: string | null) => void;
    setCurrency: (currency: CurrencyCode) => void;
    toggleWishlist: (productId: string) => void;
    /** Adds on top of the current quantity. */
    addToCart: (productId: string, quantity?: number) => void;
    /** Sets an exact quantity; zero or less removes the product from the cart. */
    setCartQuantity: (productId: string, quantity: number) => void;
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
    addToCart: (productId, quantity = 1) =>
        set((state) => ({
            cart: {
                ...state.cart,
                [productId]: Math.min(MAX_CART_QUANTITY, (state.cart[productId] ?? 0) + quantity),
            },
        })),
    setCartQuantity: (productId, quantity) =>
        set((state) => {
            if (quantity <= 0) {
                return { cart: Object.fromEntries(Object.entries(state.cart).filter(([id]) => id !== productId)) };
            }
            return { cart: { ...state.cart, [productId]: Math.min(MAX_CART_QUANTITY, quantity) } };
        }),
}));

export const selectCartCount = (state: ShopState) =>
    Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);