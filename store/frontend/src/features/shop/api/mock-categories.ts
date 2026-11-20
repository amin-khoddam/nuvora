import type { Category, CategoryFilter, FilterOption } from "../types";
import { image } from "./mock-data";

type OptionEntry = [value: string, label: string];

const options = (entries: OptionEntry[]): FilterOption[] => entries.map(([value, label]) => ({ value, label }));

const brandFilter = (entries: OptionEntry[]): CategoryFilter => ({
    key: "brand",
    label: "Brand",
    type: "multiselect",
    options: options(entries),
});

const yearFilter: CategoryFilter = {
    key: "year",
    label: "Release year",
    type: "select",
    options: options([
        ["2026", "2026"],
        ["2025", "2025"],
        ["2024", "2024"],
    ]),
};

/** Bounds are in USD here; the mock handler converts them to the requested currency. */
const priceFilter: CategoryFilter = {
    key: "price",
    label: "Price",
    type: "range",
    min: 0,
    max: 3000,
    step: 50,
    valueType: "currency",
    unit: null,
    presets: [
        { from: 0, to: 250 },
        { from: 250, to: 500 },
        { from: 500, to: 1000 },
        { from: 1000, to: 3000 },
    ],
};

interface CategoryInit {
    children?: Category[];
    filters?: CategoryFilter[];
}

const category = (id: string, slug: string, name: string, { children = [], filters = [] }: CategoryInit = {}): Category => ({
    id,
    slug,
    name,
    image: image(160, 160, name),
    filters,
    children,
});

/** Ids are opaque; slugs form the URL: /shop/smartphone/apple/iphone/iphone-17 */
export const MOCK_CATEGORIES: Category[] = [
    category("audio", "audio", "Audio", {
        filters: [
            brandFilter([
                ["sony", "Sony"],
                ["apple", "Apple"],
                ["bose", "Bose"],
            ]),
            priceFilter,
        ],
        children: [
            category("headphones", "headphones", "Headphones", {
                filters: [
                    brandFilter([
                        ["sony", "Sony"],
                        ["bose", "Bose"],
                        ["jbl", "JBL"],
                    ]),
                    {
                        key: "fit",
                        label: "Fit",
                        type: "select",
                        options: options([
                            ["over-ear", "Over-ear"],
                            ["on-ear", "On-ear"],
                        ]),
                    },
                    priceFilter,
                ],
                children: [
                    category("headphones-wireless", "wireless", "Wireless"),
                    category("headphones-gaming", "gaming", "Gaming"),
                    category("headphones-noise-cancelling", "noise-cancelling", "Noise cancelling"),
                ],
            }),
            category("earbuds", "earbuds", "Earbuds"),
            category("speakers", "speakers", "Speakers"),
        ],
    }),
    category("smartwatches", "smartwatch", "Smartwatches", {
        filters: [
            brandFilter([
                ["apple", "Apple"],
                ["samsung", "Samsung"],
            ]),
            priceFilter,
        ],
        children: [category("apple-watch", "apple-watch", "Apple Watch"), category("galaxy-watch", "galaxy-watch", "Galaxy Watch")],
    }),
    category("laptops", "laptop", "Laptops", {
        filters: [
            brandFilter([
                ["apple", "Apple"],
                ["dell", "Dell"],
                ["microsoft", "Microsoft"],
            ]),
            yearFilter,
            priceFilter,
        ],
        children: [category("macbook", "macbook", "MacBook"), category("windows-laptops", "windows", "Windows laptops")],
    }),
    category("smartphones", "smartphone", "Smartphones", {
        filters: [
            brandFilter([
                ["apple", "Apple"],
                ["samsung", "Samsung"],
                ["google", "Google"],
                ["xiaomi", "Xiaomi"],
            ]),
            yearFilter,
            priceFilter,
        ],
        children: [
            category("smartphone-apple", "apple", "Apple", {
                children: [
                    category("apple-iphone", "iphone", "iPhone", {
                        children: [
                            category("iphone-17-series", "iphone-17", "iPhone 17"),
                            category("iphone-16-series", "iphone-16", "iPhone 16"),
                            category("iphone-15-series", "iphone-15", "iPhone 15"),
                        ],
                    }),
                ],
            }),
            category("smartphone-samsung", "samsung", "Samsung", {
                children: [
                    category("samsung-galaxy-s", "galaxy-s", "Galaxy S"),
                    category("samsung-galaxy-z", "galaxy-z", "Galaxy Z"),
                ],
            }),
            category("smartphone-google", "google", "Google", {
                children: [category("google-pixel", "pixel", "Pixel")],
            }),
        ],
    }),
    category("gaming", "gaming", "Gaming", {
        children: [category("consoles", "consoles", "Consoles"), category("controllers", "controllers", "Controllers")],
    }),
    category("accessories", "accessories", "Accessories", {
        children: [category("chargers", "chargers", "Chargers"), category("cases", "cases", "Cases")],
    }),
    category("cameras", "camera", "Cameras", {
        filters: [
            brandFilter([
                ["sony", "Sony"],
                ["canon", "Canon"],
                ["dji", "DJI"],
                ["gopro", "GoPro"],
            ]),
            priceFilter,
        ],
        children: [
            category("mirrorless", "mirrorless", "Mirrorless"),
            category("action-cameras", "action-cameras", "Action cameras"),
            category("drones", "drones", "Drones"),
        ],
    }),
    category("smart-home", "smart-home", "Smart Home"),
];