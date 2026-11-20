import { shopRoutes } from "@/config/shop";
import type { SearchSuggestions } from "../types";

export function buildSearchHref(term: string): string {
    return `${shopRoutes.shop}?${new URLSearchParams({ q: term }).toString()}`;
}

/**
 * Hrefs in on-screen order: categories, then products, then "see all results".
 * The keyboard index maps 1:1 to this array. Empty when nothing matched, so
 * the hidden "see all" link can never be selected.
 */
export function getSuggestionHrefs(suggestions: SearchSuggestions, term: string): string[] {
    if (suggestions.categories.length === 0 && suggestions.products.length === 0) return [];

    return [
        ...suggestions.categories.map((category) => shopRoutes.category(category.path)),
        ...suggestions.products.map((product) => shopRoutes.product(product.slug)),
        buildSearchHref(term),
    ];
}