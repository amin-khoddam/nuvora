import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { shouldRetryRequest } from "@/lib/api/errors";
import { shopService } from "../api/shop.service";
import { useShopStore } from "../store/shop-store";
import type { CatalogQuery, CurrencyCode, ProductsQuery } from "../types";

const STALE_TIME_MS = 5 * 60_000;

export const SEARCH_MIN_LENGTH = 2;

export const shopKeys = {
    all: ["shop"] as const,
    categories: (currency: CurrencyCode) => [...shopKeys.all, "categories", currency] as const,
    heroSlides: () => [...shopKeys.all, "hero-slides"] as const,
    products: (query: ProductsQuery) => [...shopKeys.all, "products", query] as const,
    product: (slug: string, currency: CurrencyCode) => [...shopKeys.all, "product", slug, currency] as const,
    catalog: (query: CatalogQuery) => [...shopKeys.all, "catalog", query] as const,
    suggestions: (term: string, currency: CurrencyCode) => [...shopKeys.all, "suggestions", term, currency] as const,
};

const sharedOptions = { staleTime: STALE_TIME_MS, retry: shouldRetryRequest } as const;

/** Price filters come back in the selected currency, so the currency is part of the key. */
export function useCategories() {
    const currency = useShopStore((state) => state.currency);

    return useQuery({
        queryKey: shopKeys.categories(currency),
        queryFn: ({ signal }) => shopService.getCategories(currency, signal),
        select: (response) => response.data,
        placeholderData: keepPreviousData,
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

/**
 * Paged product list for category pages and search; pages load on demand.
 * The previous list stays visible while sort, filters or currency change, but
 * never across a different category or search term, where it would show
 * unrelated products under the new heading.
 */
export function useCatalog(query: CatalogQuery) {
    return useInfiniteQuery({
        queryKey: shopKeys.catalog(query),
        queryFn: ({ pageParam, signal }) => shopService.getCatalog(query, pageParam, signal),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.meta.page < lastPage.meta.totalPages ? lastPage.meta.page + 1 : undefined,
        placeholderData: (previousData, previousQuery) => {
            const previous = previousQuery?.queryKey[2];
            const isSameListing = previous?.category === query.category && previous?.q === query.q;
            return isSameListing ? previousData : undefined;
        },
        ...sharedOptions,
    });
}

export function useSearchSuggestions(term: string) {
    const currency = useShopStore((state) => state.currency);

    return useQuery({
        queryKey: shopKeys.suggestions(term, currency),
        queryFn: ({ signal }) => shopService.getSuggestions(term, currency, signal),
        select: (response) => response.data,
        enabled: term.length >= SEARCH_MIN_LENGTH,
        placeholderData: keepPreviousData,
        staleTime: 60_000,
        retry: shouldRetryRequest,
    });
}