import type { ProductCollection } from "@/features/shop/types";

export const shopRoutes = {
    home: "/",
    shop: "/shop",
    categories: "/categories",
    category: (slug: string) => `/shop?category=${encodeURIComponent(slug)}`,
    collection: (collection: ProductCollection) => `/shop?collection=${collection}`,
    product: (slug: string) => `/products/${encodeURIComponent(slug)}`,
} as const;

type ShopNavItem =
    | { id: "home" | "shop" | "about" | "contact"; href: string }
    | { id: "categories"; href?: undefined };

/** Header order. `categories` renders as a dropdown, the rest are plain links. */
export const shopNavItems = [
    { id: "home", href: shopRoutes.home },
    { id: "shop", href: shopRoutes.shop },
    { id: "categories" },
    { id: "about", href: "/about" },
    { id: "contact", href: "/contact" },
] as const satisfies readonly ShopNavItem[];

export const promoBanner = {
    image: "https://placehold.co/900x520/png?text=MacBook+Air",
    href: shopRoutes.shop,
} as const;

/** Ids double as translation keys under `shop.footer`. */
export const footerColumns = [
    {
        id: "shop",
        links: [
            { id: "allProducts", href: "/shop" },
            { id: "categories", href: "/categories" },
            { id: "deals", href: "/deals" },
            { id: "newArrivals", href: "/new-arrivals" },
        ],
    },
    {
        id: "support",
        links: [
            { id: "helpCenter", href: "/help" },
            { id: "shippingInfo", href: "/shipping" },
            { id: "returns", href: "/returns" },
            { id: "contactUs", href: "/contact" },
        ],
    },
    {
        id: "about",
        links: [
            { id: "ourStory", href: "/about" },
            { id: "careers", href: "/careers" },
            { id: "blog", href: "/blog" },
            { id: "press", href: "/press" },
        ],
    },
] as const;

export const legalLinks = [
    { id: "privacy", href: "/privacy" },
    { id: "terms", href: "/terms" },
    { id: "cookies", href: "/cookies" },
] as const;