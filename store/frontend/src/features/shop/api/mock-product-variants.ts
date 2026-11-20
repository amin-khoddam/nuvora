import type { ProductColor, ProductSeller, ProductSize, VariantOffer } from "../types";

const offer = (price: number, stock: number, compareAtPrice: number | null = null): VariantOffer => ({
    price,
    compareAtPrice,
    stock,
});

const size = (id: string, label: string, sizeOffer: VariantOffer): ProductSize => ({ id, label, ...sizeOffer });

const colorWithOffer = (id: string, name: string, hex: string, colorOffer: VariantOffer): ProductColor => ({
    id,
    name,
    hex,
    offer: colorOffer,
    sizes: [],
});

const colorWithSizes = (id: string, name: string, hex: string, sizes: ProductSize[]): ProductColor => ({
    id,
    name,
    hex,
    offer: null,
    sizes,
});

const seller = (id: string, name: string, rating: number | null, colors: ProductColor[]): ProductSeller => ({
    id,
    name,
    rating,
    colors,
});

/**
 * USD prices; the mock handler converts them. Products missing here get a
 * single-seller, single-color fallback (see `mock-handlers.ts`).
 *
 * Covered cases: several sellers / one seller, colors with sizes / without
 * sizes, per-size prices, partly and fully out of stock.
 */
export const MOCK_PRODUCT_SELLERS: Record<string, ProductSeller[]> = {
    // Two sellers, colors without sizes.
    "airpods-pro-2": [
        seller("nuvora", "Nuvora Official", 4.9, [colorWithOffer("white", "White", "#f5f5f7", offer(249, 24, 299))]),
        seller("techhub", "TechHub", 4.6, [
            colorWithOffer("white", "White", "#f5f5f7", offer(239, 3, 299)),
            colorWithOffer("graphite", "Graphite", "#3a3a3c", offer(259, 9, 299)),
        ]),
    ],
    // Two sellers, colors with sizes, price depends on the size.
    "apple-watch-10": [
        seller("nuvora", "Nuvora Official", 4.9, [
            colorWithSizes("jet-black", "Jet Black", "#1c1c1e", [
                size("42mm", "42 mm", offer(349, 12, 399)),
                size("46mm", "46 mm", offer(379, 8, 429)),
            ]),
            colorWithSizes("silver", "Silver", "#d9dadb", [
                size("42mm", "42 mm", offer(349, 5, 399)),
                size("46mm", "46 mm", offer(379, 0, 429)),
            ]),
        ]),
        seller("techhub", "TechHub", 4.6, [
            colorWithSizes("jet-black", "Jet Black", "#1c1c1e", [
                size("42mm", "42 mm", offer(339, 2, 399)),
                size("46mm", "46 mm", offer(369, 6, 429)),
            ]),
        ]),
    ],
    // One seller (shown as "Sold by"), colors with sizes.
    "macbook-air-m4": [
        seller("nuvora", "Nuvora Official", 4.9, [
            colorWithSizes("midnight", "Midnight", "#2e3642", [
                size("13", "13-inch", offer(1099, 10, 1249)),
                size("15", "15-inch", offer(1299, 6, 1449)),
            ]),
            colorWithSizes("starlight", "Starlight", "#e3d9c9", [
                size("13", "13-inch", offer(1099, 4, 1249)),
                size("15", "15-inch", offer(1299, 0, 1449)),
            ]),
            colorWithSizes("sky-blue", "Sky Blue", "#9db8d2", [size("13", "13-inch", offer(1129, 7, 1249))]),
        ]),
    ],
    // One seller, one color, low stock.
    "ps5-slim": [
        seller("nuvora", "Nuvora Official", 4.9, [colorWithOffer("white", "White", "#f4f4f5", offer(399, 4, 499))]),
    ],
    // Two sellers, prices differ per color.
    "sony-wh-1000xm6": [
        seller("nuvora", "Nuvora Official", 4.9, [
            colorWithOffer("black", "Black", "#18181b", offer(449, 15)),
            colorWithOffer("silver", "Silver", "#cfd2d6", offer(459, 6)),
        ]),
        seller("audiomart", "AudioMart", 4.7, [colorWithOffer("black", "Black", "#18181b", offer(439, 2))]),
    ],
    // Two sellers, sizes (screen size) and per-size price.
    "iphone-16": [
        seller("nuvora", "Nuvora Official", 4.9, [
            colorWithSizes("black", "Black", "#2b2b2d", [
                size("6-1", "6.1-inch", offer(799, 20)),
                size("6-7", "6.7-inch", offer(899, 11)),
            ]),
            colorWithSizes("ultramarine", "Ultramarine", "#6f86e0", [
                size("6-1", "6.1-inch", offer(799, 9)),
                size("6-7", "6.7-inch", offer(899, 0)),
            ]),
        ]),
        seller("techhub", "TechHub", 4.5, [
            colorWithSizes("black", "Black", "#2b2b2d", [size("6-1", "6.1-inch", offer(789, 3))]),
        ]),
    ],
    "galaxy-s25": [
        seller("nuvora", "Nuvora Official", 4.9, [
            colorWithOffer("navy", "Navy", "#1f2a44", offer(749, 14)),
            colorWithOffer("silver", "Silver Shadow", "#c4c7cc", offer(749, 8)),
        ]),
    ],
    // Fully out of stock.
    "dji-mini-4-pro": [
        seller("nuvora", "Nuvora Official", 4.9, [colorWithOffer("gray", "Gray", "#71717a", offer(759, 0))]),
    ],
};