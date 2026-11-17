import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { shouldRetryRequest } from "@/lib/api/errors";
import { shopService } from "../api/shop.service";
import type { CurrencyCode, ProductsQuery } from "../types";

const STALE_TIME_MS = 5 * 60_000;

export const shopKeys = {
    all: ["shop"] as const,
    categories: () => [...shopKeys.all, "categories"] as const,
    heroSlides: () => [...shopKeys.all, "hero-slides"] as const,
    products: (query: ProductsQuery) => [...shopKeys.all, "products", query] as const,
    product: (slug: string, currency: CurrencyCode) => [...shopKeys.all, "product", slug, currency] as const,
};

const sharedOptions = { staleTime: STALE_TIME_MS, retry: shouldRetryRequest } as const;

export function useCategories() {
    return useQuery({
        queryKey: shopKeys.categories(),
        queryFn: ({ signal }) => shopService.getCategories(signal),
        select: (response) => response.data,
        ...sharedOptions,
    });
}

export function useHeroSlides() {
    return useQuery({
        queryKey: shopKeys.heroSlides(),
        queryFn: ({ signal }) => shopService.getHeroSlides(signal),
        select: (response) => response.data,
        ...sharedOptions,
    });
}

export function useProducts(query: ProductsQuery) {
    return useQuery({
        queryKey: shopKeys.products(query),
        queryFn: ({ signal }) => shopService.getProducts(query, signal),
        select: (response) => response.data,
        // Keeps the old grid visible while a new sort/filter/currency loads.
        placeholderData: keepPreviousData,
        ...sharedOptions,
    });
}

export function useProduct(slug: string, currency: CurrencyCode) {
    return useQuery({
        queryKey: shopKeys.product(slug, currency),
        queryFn: ({ signal }) => shopService.getProduct(slug, currency, signal),
        select: (response) => response.data,
        // A currency switch keeps the page; a different product must never show the previous one.
        placeholderData: (previous) => (previous?.data.slug === slug ? previous : undefined),
        ...sharedOptions,
    });
}