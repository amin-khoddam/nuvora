import type { ProductColor, ProductSeller } from "../types";

const color = (
    id: string,
    name: string,
    hex: string,
    price: number,
    stock: number,
    compareAtPrice: number | null = null,
): ProductColor => ({ id, name, hex, price, stock, compareAtPrice });

const seller = (id: string, name: string, rating: number | null, colors: ProductColor[]): ProductSeller => ({
    id,
    name,
    rating,
    colors,
});

/**
 * USD prices; the mock handler converts them. Products missing here get a
 * single-seller, single-color fallback (see `mock-handlers.ts`).
 */
export const MOCK_PRODUCT_SELLERS: Record<string, ProductSeller[]> = {
    // Two sellers; the second has more colors and a cheaper white.
    "airpods-pro-2": [
        seller("nuvora", "Nuvora Official", 4.9, [color("white", "White", "#f5f5f7", 249, 24, 299)]),
        seller("techhub", "TechHub", 4.6, [
            color("white", "White", "#f5f5f7", 239, 3, 299),
            color("graphite", "Graphite", "#3a3a3c", 259, 9, 299),
        ]),
    ],
    // Two sellers, price differs by color, one color sold out.
    "apple-watch-10": [
        seller("nuvora", "Nuvora Official", 4.9, [
            color("jet-black", "Jet Black", "#1c1c1e", 349, 12, 399),
            color("silver", "Silver", "#d9dadb", 349, 5, 399),
            color("rose-gold", "Rose Gold", "#e6b8a8", 369, 0, 399),
        ]),
        seller("techhub", "TechHub", 4.6, [
            color("jet-black", "Jet Black", "#1c1c1e", 339, 2, 399),
            color("silver", "Silver", "#d9dadb", 345, 6, 399),
        ]),
    ],
    // One seller (shown as "Sold by").
    "macbook-air-m4": [
        seller("nuvora", "Nuvora Official", 4.9, [
            color("midnight", "Midnight", "#2e3642", 1099, 10, 1249),
            color("starlight", "Starlight", "#e3d9c9", 1099, 4, 1249),
            color("sky-blue", "Sky Blue", "#9db8d2", 1129, 7, 1249),
        ]),
    ],
    // One seller, one color, low stock.
    "ps5-slim": [seller("nuvora", "Nuvora Official", 4.9, [color("white", "White", "#f4f4f5", 399, 4, 499)])],
    "sony-wh-1000xm6": [
        seller("nuvora", "Nuvora Official", 4.9, [
            color("black", "Black", "#18181b", 449, 15),
            color("silver", "Silver", "#cfd2d6", 459, 6),
        ]),
        seller("audiomart", "AudioMart", 4.7, [color("black", "Black", "#18181b", 439, 2)]),
    ],
    "iphone-16": [
        seller("nuvora", "Nuvora Official", 4.9, [
            color("black", "Black", "#2b2b2d", 799, 20),
            color("ultramarine", "Ultramarine", "#6f86e0", 799, 9),
            color("pink", "Pink", "#f3c6d3", 829, 0),
        ]),
        seller("techhub", "TechHub", 4.5, [
            color("black", "Black", "#2b2b2d", 789, 3),
            color("teal", "Teal", "#8fc9c2", 799, 5),
        ]),
    ],
    "galaxy-s25": [
        seller("nuvora", "Nuvora Official", 4.9, [
            color("navy", "Navy", "#1f2a44", 749, 14),
            color("silver", "Silver Shadow", "#c4c7cc", 749, 8),
        ]),
    ],
    // Fully out of stock.
    "dji-mini-4-pro": [seller("nuvora", "Nuvora Official", 4.9, [color("gray", "Gray", "#71717a", 759, 0)])],
};