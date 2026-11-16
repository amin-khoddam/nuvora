import { apiConfig } from "@/config/api";
import { apiClient } from "@/lib/api/client";
import { getMockCategories, getMockHeroSlides, getMockProducts } from "./mock-handlers";
import type { ApiListResponse, Category, HeroSlide, Product, ProductsQuery } from "../types";

const ENDPOINTS = {
    categories: "/shop/categories",
    heroSlides: "/shop/hero-slides",
    products: "/shop/products",
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
    getCategories: (signal?: AbortSignal) =>
        request<ApiListResponse<Category>>(ENDPOINTS.categories, getMockCategories, { signal }),

    getHeroSlides: (signal?: AbortSignal) =>
        request<ApiListResponse<HeroSlide>>(ENDPOINTS.heroSlides, getMockHeroSlides, { signal }),

    getProducts: (query: ProductsQuery, signal?: AbortSignal) =>
        request<ApiListResponse<Product>>(ENDPOINTS.products, () => getMockProducts(query), {
            params: query,
            signal,
        }),
};