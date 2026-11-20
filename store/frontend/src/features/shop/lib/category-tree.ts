import { shopRoutes } from "@/config/shop";
import type { Category, CategoryFilter } from "../types";

/** Walks `ids` down the tree and stops at the first id that is not a child. */
export function resolvePathByIds(roots: readonly Category[], ids: readonly string[]): Category[] {
    const path: Category[] = [];
    let level = roots;

    for (const id of ids) {
        const next = level.find((category) => category.id === id);
        if (!next) break;
        path.push(next);
        level = next.children;
    }
    return path;
}

/** Resolves URL slugs to a category chain, or null when any segment does not exist. */
export function resolvePathBySlugs(roots: readonly Category[], slugs: readonly string[]): Category[] | null {
    const path: Category[] = [];
    let level = roots;

    for (const slug of slugs) {
        const next = level.find((category) => category.slug === slug);
        if (!next) return null;
        path.push(next);
        level = next.children;
    }
    return path;
}

export function findPathById(roots: readonly Category[], id: string): Category[] | null {
    for (const category of roots) {
        if (category.id === id) return [category];

        const childPath = findPathById(category.children, id);
        if (childPath) return [category, ...childPath];
    }
    return null;
}

/** The nearest filters defined on the category or one of its ancestors. */
export function getEffectiveFilters(path: readonly Category[]): CategoryFilter[] {
    for (let index = path.length - 1; index >= 0; index -= 1) {
        const filters = path[index]?.filters;
        if (filters && filters.length > 0) return filters;
    }
    return [];
}

export function getCategoryHref(path: readonly Category[]): string {
    return path.length === 0 ? shopRoutes.shop : shopRoutes.category(path.map((category) => category.slug));
}

/** The category's own id plus the ids of every descendant. */
export function collectCategoryIds(category: Category): string[] {
    return [category.id, ...category.children.flatMap(collectCategoryIds)];
}

/** Keys of every range filter whose values are money (e.g. `price`), anywhere in the tree. */
export function collectCurrencyFilterKeys(roots: readonly Category[]): string[] {
    const keys = new Set<string>();

    const visit = (nodes: readonly Category[]) => {
        for (const node of nodes) {
            for (const filter of node.filters) {
                if (filter.type === "range" && filter.valueType === "currency") keys.add(filter.key);
            }
            visit(node.children);
        }
    };

    visit(roots);
    return [...keys];
}