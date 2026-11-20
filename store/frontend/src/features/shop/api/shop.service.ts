import { apiConfig } from "@/config/api";
import { apiClient } from "@/lib/api/client";
import {
    getMockCatalog,
    getMockCategories,
    getMockHeroSlides,
    getMockProduct,
    getMockProducts,
    getMockSuggestions,
} from "./mock-handlers";
import type {
    ApiItemResponse,
    ApiListResponse,
    ApiPagedResponse,
    CatalogQuery,
    Category,
    CurrencyCode,
    HeroSlide,
    Product,
    ProductDetail,
    ProductsQuery,
    SearchSuggestions,
} from "../types";

const ENDPOINTS = {
    categories: "/shop/categories",
    heroSlides: "/shop/hero-slides",
    products: "/shop/products",
    product: (slug: string) => `/shop/products/${encodeURIComponent(slug)}`,
    catalog: "/shop/catalog",
    suggestions: "/shop/search/suggestions",
} as const;

/** Endpoint that exists on the fake API used while mocking. */
const FAKE_ENDPOINT = "/posts/1";

/**
 * In mock mode a real request still goes out (so the client, interceptors and
 * error handling are exercised) but its body is discarded and `mock()` is
 * returned. With mocking off the response body is returned as-is, so the
 * backend must match the types in `../types`.
 */
async function request<T>(
    endpoint: string,
    mock: () => T,
    options: { params?: object; signal?: AbortSignal } = {},
): Promise<T> {
    if (apiConfig.useMock) {
        await apiClient.get(FAKE_ENDPOINT, { signal: options.signal });
        return mock();
    }

    const { data } = await apiClient.get<T>(endpoint, options);
    return data;
}

export const shopService = {
    getCategories: (currency: CurrencyCode, signal?: AbortSignal) =>
        request<ApiListResponse<Category>>(ENDPOINTS.categories, () => getMockCategories(currency), {
            params: { currency },
            signal,
        }),

    getHeroSlides: (signal?: AbortSignal) =>
        request<ApiListResponse<HeroSlide>>(ENDPOINTS.heroSlides, getMockHeroSlides, { signal }),

    getProducts: (query: ProductsQuery, signal?: AbortSignal) =>
        request<ApiListResponse<Product>>(ENDPOINTS.products, () => getMockProducts(query), {
            params: query,
            signal,
        }),

    getProduct: (slug: string, currency: CurrencyCode, signal?: AbortSignal) =>
        request<ApiItemResponse<ProductDetail>>(ENDPOINTS.product(slug), () => getMockProduct(slug, currency), {
            params: { currency },
            signal,
        }),

    /** Filters are sent as top-level parameters: `?brand=a&brand=b&price=100-500`. */
    getCatalog: (query: CatalogQuery, page: number, signal?: AbortSignal) =>
        request<ApiPagedResponse<Product>>(ENDPOINTS.catalog, () => getMockCatalog(query, page), {
            params: {
                ...query.filters,
                category: query.category,
                q: query.q,
                sort: query.sort,
                currency: query.currency,
                pageSize: query.pageSize,
                page,
            },
            signal,
        }),

    getSuggestions: (term: string, currency: CurrencyCode, signal?: AbortSignal) =>
        request<ApiItemResponse<SearchSuggestions>>(
            ENDPOINTS.suggestions,
            () => getMockSuggestions(term, currency),
            { params: { q: term, currency }, signal },
        ),
};