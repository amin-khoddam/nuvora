import type { ProductSpec, StockStatus } from "../types";

interface ProductDetailExtras {
    description: string;
    gallery: string[];
    highlights: string[];
    specs: ProductSpec[];
    stockStatus: StockStatus;
}

const gallery = (name: string): string[] =>
    ["Front", "Side", "Back", "Box"].map(
        (view) => `https://placehold.co/800x800/png?text=${encodeURIComponent(`${name} ${view}`)}`,
    );

/** Detail-only fields, keyed by product id. Everything else comes from the list mock. */
export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetailExtras> = {
    "airpods-pro-2": {
        description:
            "Active noise cancellation, adaptive transparency and personalised spatial audio in a pocketable case with up to 30 hours of total listening time.",
        gallery: gallery("AirPods Pro"),
        highlights: ["Up to 2x more noise cancellation", "Up to 30 hours with the case", "Dust and sweat resistant"],
        specs: [
            { label: "Chip", value: "H2" },
            { label: "Battery", value: "6 h (buds), 30 h (case)" },
            { label: "Connectivity", value: "Bluetooth 5.3" },
            { label: "Charging", value: "USB-C, MagSafe, Qi" },
        ],
        stockStatus: "inStock",
    },
    "ps5-slim": {
        description:
            "The slimmer PlayStation 5 with an ultra-high-speed SSD, ray tracing and 4K gaming up to 120 fps, now with 1 TB of storage.",
        gallery: gallery("PS5 Slim"),
        highlights: ["1 TB ultra-high-speed SSD", "4K output up to 120 fps", "DualSense haptic feedback"],
        specs: [
            { label: "Storage", value: "1 TB SSD" },
            { label: "Resolution", value: "Up to 4K / 120 Hz" },
            { label: "Optical drive", value: "Ultra HD Blu-ray" },
            { label: "Ports", value: "HDMI 2.1, USB-C, USB-A" },
        ],
        stockStatus: "lowStock",
    },
    "apple-watch-10": {
        description:
            "The thinnest Apple Watch yet, with the largest display, faster charging and advanced health and fitness tracking.",
        gallery: gallery("Apple Watch"),
        highlights: ["Wide-angle always-on display", "Up to 18 hours of battery", "Water resistant to 50 m"],
        specs: [
            { label: "Display", value: "LTPO3 OLED" },
            { label: "Battery", value: "Up to 18 h" },
            { label: "Sensors", value: "ECG, blood oxygen, temperature" },
            { label: "Case", value: "Aluminium, 42 / 46 mm" },
        ],
        stockStatus: "inStock",
    },
    "macbook-air-m4": {
        description:
            "A thin and light laptop powered by the M4 chip, with a Liquid Retina display and all-day battery life.",
        gallery: gallery("MacBook Air"),
        highlights: ["Apple M4 chip", "Up to 18 hours of battery", "Liquid Retina display"],
        specs: [
            { label: "Chip", value: "Apple M4, 10-core CPU" },
            { label: "Memory", value: "16 GB unified" },
            { label: "Storage", value: "256 GB SSD" },
            { label: "Weight", value: "1.24 kg" },
        ],
        stockStatus: "inStock",
    },
    "iphone-16": {
        description:
            "A18 chip, a dual-camera system with Camera Control and a durable aluminium design, built for Apple Intelligence.",
        gallery: gallery("iPhone 16"),
        highlights: ["A18 chip", "48 MP Fusion camera", "Action button and Camera Control"],
        specs: [
            { label: "Display", value: "6.1\" Super Retina XDR" },
            { label: "Chip", value: "A18" },
            { label: "Storage", value: "128 GB" },
            { label: "Connector", value: "USB-C" },
        ],
        stockStatus: "inStock",
    },
    "galaxy-s25": {
        description:
            "A compact flagship with Galaxy AI features, a bright Dynamic AMOLED display and a pro-grade triple camera.",
        gallery: gallery("Galaxy S25"),
        highlights: ["Galaxy AI features", "50 MP triple camera", "7 years of OS updates"],
        specs: [
            { label: "Display", value: "6.2\" Dynamic AMOLED 2X" },
            { label: "Memory", value: "12 GB" },
            { label: "Storage", value: "256 GB" },
            { label: "Battery", value: "4000 mAh" },
        ],
        stockStatus: "inStock",
    },
    "sony-wh-1000xm6": {
        description:
            "Industry-leading noise cancelling headphones with refined sound, multipoint connection and a comfortable foldable design.",
        gallery: gallery("Sony XM6"),
        highlights: ["Industry-leading noise cancelling", "Up to 30 hours of battery", "Multipoint Bluetooth"],
        specs: [
            { label: "Driver", value: "30 mm" },
            { label: "Battery", value: "Up to 30 h" },
            { label: "Connectivity", value: "Bluetooth 5.3, 3.5 mm" },
            { label: "Weight", value: "254 g" },
        ],
        stockStatus: "lowStock",
    },
    "dji-mini-4-pro": {
        description:
            "A sub-250 g drone with 4K/60 HDR video, omnidirectional obstacle sensing and up to 34 minutes of flight time.",
        gallery: gallery("DJI Mini 4 Pro"),
        highlights: ["Under 249 g", "4K/60fps HDR video", "Omnidirectional obstacle sensing"],
        specs: [
            { label: "Camera", value: "1/1.3\" CMOS, 48 MP" },
            { label: "Flight time", value: "Up to 34 min" },
            { label: "Range", value: "20 km (FCC)" },
            { label: "Weight", value: "< 249 g" },
        ],
        stockStatus: "outOfStock",
    },
};