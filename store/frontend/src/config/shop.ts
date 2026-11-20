import type { ProductCollection } from "@/features/shop/types";

export const shopRoutes = {
    home: "/",
    shop: "/shop",
    categories: "/categories",
    /** Accepts one slug or the whole slug chain: `/shop/audio/headphones/gaming`. */
    category: (path: string | readonly string[]) => {
        const slugs = typeof path === "string" ? [path] : path;
        return `/shop/${slugs.map(encodeURIComponent).join("/")}`;
    },
    collection: (collection: ProductCollection) => `/shop?collection=${collection}`,
    product: (slug: string) => `/products/${encodeURIComponent(slug)}`,
} as const;

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