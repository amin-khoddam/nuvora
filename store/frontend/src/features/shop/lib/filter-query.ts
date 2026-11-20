import type { CategoryFilter } from "../types";

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export interface FilterLink {
    value: string;
    label: string;
    href: string;
}

export interface ActiveFilter {
    key: string;
    filterLabel: string;
    valueLabel: string;
}

const RANGE_PATTERN = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/;

function toArray(value: string | string[] | undefined): string[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}

export function formatRangeValue(from: number, to: number): string {
    return `${from}-${to}`;
}

function parseRange(value: string | undefined): { from: number; to: number } | null {
    const match = value ? RANGE_PATTERN.exec(value) : null;
    if (!match) return null;

    const from = Number(match[1]);
    const to = Number(match[2]);
    return from <= to ? { from, to } : null;
}

export function buildFilterHref(basePath: string, key: string, value: string): string {
    return `${basePath}?${new URLSearchParams({ [key]: value }).toString()}`;
}

/** Every link a filter offers, e.g. each brand or each price preset. */
export function getFilterLinks(filter: CategoryFilter, basePath: string): FilterLink[] {
    switch (filter.type) {
        case "select":
        case "multiselect":
            return filter.options.map((option) => ({
                value: option.value,
                label: option.label,
                href: buildFilterHref(basePath, filter.key, option.value),
            }));
        case "range":
            return filter.presets.map((preset) => {
                const value = formatRangeValue(preset.from, preset.to);
                return { value, label: preset.label, href: buildFilterHref(basePath, filter.key, value) };
            });
    }
}

/** Keeps only query values that match the category's filter definitions. */
export function parseActiveFilters(
    filters: readonly CategoryFilter[],
    search: SearchParamsRecord,
): ActiveFilter[] {
    return filters.flatMap((filter): ActiveFilter[] => {
        const values = toArray(search[filter.key]);

        switch (filter.type) {
            case "select": {
                const option = filter.options.find((item) => item.value === values[0]);
                return option ? [{ key: filter.key, filterLabel: filter.label, valueLabel: option.label }] : [];
            }
            case "multiselect": {
                const labels = filter.options.filter((item) => values.includes(item.value)).map((item) => item.label);
                return labels.length > 0
                    ? [{ key: filter.key, filterLabel: filter.label, valueLabel: labels.join(", ") }]
                    : [];
            }
            case "range": {
                const range = parseRange(values[0]);
                if (!range) return [];
                const unit = filter.unit ? ` ${filter.unit}` : "";
                return [{ key: filter.key, filterLabel: filter.label, valueLabel: `${range.from}–${range.to}${unit}` }];
            }
        }
    });
}