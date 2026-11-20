import { getDiscountPercent } from "../lib/variants";
import type { Product } from "../types";
import { image } from "./mock-data";

/** `attributes` stand in for the fields the backend filters on (brand, year, fit...). */
export interface CatalogEntry {
    product: Product;
    attributes: Record<string, string>;
}

type Row = [categoryId: string, brand: string, year: number, priceUsd: number, name: string];

const ROWS: Row[] = [
    ["headphones-wireless", "sony", 2025, 199, "Sony WH-CH720N"],
    ["headphones-wireless", "sony", 2024, 399, "Sony WH-1000XM5"],
    ["headphones-wireless", "bose", 2025, 329, "Bose QuietComfort Headphones"],
    ["headphones-wireless", "bose", 2024, 429, "Bose QuietComfort Ultra"],
    ["headphones-wireless", "jbl", 2025, 129, "JBL Tune 770NC"],
    ["headphones-gaming", "jbl", 2024, 99, "JBL Quantum 100"],
    ["headphones-gaming", "jbl", 2025, 179, "JBL Quantum 400"],
    ["headphones-gaming", "sony", 2025, 149, "Sony INZONE H5"],
    ["headphones-noise-cancelling", "sony", 2026, 449, "Sony WH-1000XM6"],
    ["headphones-noise-cancelling", "bose", 2024, 379, "Bose Noise Cancelling Headphones 700"],
    ["headphones-noise-cancelling", "jbl", 2025, 149, "JBL Live 770NC"],
    ["earbuds", "apple", 2024, 249, "AirPods Pro (2nd Gen)"],
    ["earbuds", "apple", 2024, 129, "AirPods 4"],
    ["earbuds", "sony", 2025, 299, "Sony WF-1000XM5"],
    ["earbuds", "bose", 2025, 299, "Bose QuietComfort Ultra Earbuds"],
    ["speakers", "bose", 2025, 149, "Bose SoundLink Flex"],
    ["speakers", "sony", 2024, 59, "Sony SRS-XB100"],
    ["speakers", "jbl", 2025, 179, "JBL Charge 6"],
    ["apple-watch", "apple", 2025, 349, "Apple Watch Series 10"],
    ["apple-watch", "apple", 2025, 799, "Apple Watch Ultra 2"],
    ["apple-watch", "apple", 2024, 249, "Apple Watch SE"],
    ["galaxy-watch", "samsung", 2025, 299, "Galaxy Watch 7"],
    ["galaxy-watch", "samsung", 2025, 649, "Galaxy Watch Ultra"],
    ["galaxy-watch", "samsung", 2024, 199, "Galaxy Watch FE"],
    ["macbook", "apple", 2025, 1099, "MacBook Air 13 M4"],
    ["macbook", "apple", 2025, 1299, "MacBook Air 15 M4"],
    ["macbook", "apple", 2024, 1599, "MacBook Pro 14 M4"],
    ["macbook", "apple", 2026, 2499, "MacBook Pro 16 M4 Max"],
    ["windows-laptops", "dell", 2025, 999, "Dell XPS 13"],
    ["windows-laptops", "dell", 2025, 1499, "Dell XPS 15"],
    ["windows-laptops", "dell", 2024, 699, "Dell Inspiron 14"],
    ["windows-laptops", "microsoft", 2025, 999, "Surface Laptop 7"],
    ["windows-laptops", "microsoft", 2024, 1199, "Surface Pro 11"],
    ["iphone-17-series", "apple", 2026, 799, "iPhone 17"],
    ["iphone-17-series", "apple", 2026, 999, "iPhone 17 Air"],
    ["iphone-17-series", "apple", 2026, 1099, "iPhone 17 Pro"],
    ["iphone-17-series", "apple", 2026, 1199, "iPhone 17 Pro Max"],
    ["iphone-16-series", "apple", 2025, 799, "iPhone 16"],
    ["iphone-16-series", "apple", 2025, 899, "iPhone 16 Plus"],
    ["iphone-15-series", "apple", 2024, 699, "iPhone 15"],
    ["samsung-galaxy-s", "samsung", 2025, 999, "Galaxy S25 Plus"],
    ["samsung-galaxy-s", "samsung", 2025, 1299, "Galaxy S25 Ultra"],
    ["samsung-galaxy-s", "samsung", 2024, 799, "Galaxy S24"],
    ["samsung-galaxy-z", "samsung", 2025, 1999, "Galaxy Z Fold 7"],
    ["samsung-galaxy-z", "samsung", 2025, 1099, "Galaxy Z Flip 7"],
    ["google-pixel", "google", 2025, 799, "Pixel 9"],
    ["google-pixel", "google", 2025, 999, "Pixel 9 Pro"],
    ["google-pixel", "google", 2026, 799, "Pixel 10"],
    ["consoles", "sony", 2024, 399, "PlayStation 5 Slim"],
    ["consoles", "microsoft", 2024, 449, "Xbox Series X"],
    ["consoles", "nintendo", 2025, 449, "Nintendo Switch 2"],
    ["consoles", "valve", 2024, 549, "Steam Deck OLED"],
    ["controllers", "sony", 2024, 69, "DualSense Wireless Controller"],
    ["controllers", "microsoft", 2024, 59, "Xbox Wireless Controller"],
    ["controllers", "nintendo", 2025, 79, "Switch 2 Pro Controller"],
    ["chargers", "anker", 2025, 59, "Anker 737 Charger"],
    ["chargers", "apple", 2024, 39, "Apple 35W Dual USB-C Charger"],
    ["chargers", "apple", 2024, 39, "MagSafe Charger"],
    ["cases", "spigen", 2025, 29, "Spigen Tough Armor Case"],
    ["cases", "apple", 2025, 49, "Apple Silicone Case"],
    ["mirrorless", "sony", 2024, 2499, "Sony A7 IV"],
    ["mirrorless", "canon", 2024, 2499, "Canon EOS R6 Mark II"],
    ["mirrorless", "sony", 2025, 1399, "Sony A6700"],
    ["action-cameras", "gopro", 2025, 499, "GoPro HERO13 Black Creator Edition"],
    ["action-cameras", "dji", 2025, 399, "DJI Osmo Action 5 Pro"],
    ["drones", "dji", 2025, 759, "DJI Mini 4 Pro"],
    ["drones", "dji", 2025, 1099, "DJI Air 3S"],
    ["smart-home", "google", 2025, 99, "Google Nest Hub"],
    ["smart-home", "amazon", 2025, 49, "Amazon Echo Dot"],
    ["smart-home", "apple", 2025, 99, "Apple HomePod mini"],
];

const slugify = (name: string) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

/** Prices are in USD; the mock handler converts them. */
export const MOCK_CATALOG: CatalogEntry[] = ROWS.map(([categoryId, brand, year, price, name], index) => {
    const slug = slugify(name);
    const compareAtPrice = index % 3 === 0 ? Math.round(price * 1.15) : null;

    return {
        product: {
            id: slug,
            slug,
            name,
            image: image(600, 450, name),
            price,
            compareAtPrice,
            discountPercent: getDiscountPercent(price, compareAtPrice),
            currency: "USD",
            rating: Number((4.2 + ((index * 7) % 8) / 10).toFixed(1)),
            reviewCount: 400 + ((index * 379) % 9000),
            categoryId,
            createdAt: new Date(Date.UTC(year, index % 12, 1 + (index % 27))).toISOString(),
        },
        attributes: {
            brand,
            year: String(year),
            ...(categoryId.startsWith("headphones") ? { fit: index % 2 === 0 ? "over-ear" : "on-ear" } : {}),
        },
    };
});