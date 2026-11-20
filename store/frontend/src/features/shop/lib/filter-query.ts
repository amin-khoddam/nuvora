import { formatPrice } from "./format";
import type { CategoryFilter, CurrencyCode, RangeFilter } from "../types";

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
    /** Valid values taken from the URL; a range is a single `from-to` string. */
    values: string[];
}

const RANGE_PATTERN = /^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/;

function toArray(value: string | string[] | undefined): string[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}

export function toURLSearchParams(search: SearchParamsRecord): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(search)) {
        for (const item of toArray(value)) params.append(key, item);
    }
    return params;
}

export function readParam(search: SearchParamsRecord, key: string): string | null {
    return toArray(search[key])[0] ?? null;
}

export function formatRangeValue(from: number, to: number): string {
    return `${from}-${to}`;
}

export function parseRangeValue(value: string | null | undefined): { from: number; to: number } | null {
    const match = value ? RANGE_PATTERN.exec(value) : null;
    if (!match) return null;

    const from = Number(match[1]);
    const to = Number(match[2]);
    return from <= to ? { from, to } : null;
}

export function formatFilterNumber(filter: RangeFilter, amount: number, currency: CurrencyCode): string {
    if (filter.valueType === "currency") return formatPrice(amount, currency);
    return filter.unit ? `${amount} ${filter.unit}` : String(amount);
}

export function formatRangeLabel(filter: RangeFilter, from: number, to: number, currency: CurrencyCode): string {
    return `${formatFilterNumber(filter, from, currency)} – ${formatFilterNumber(filter, to, currency)}`;
}

export function buildFilterHref(basePath: string, key: string, value: string): string {
    return `${basePath}?${new URLSearchParams({ [key]: value }).toString()}`;
}

/** Every link a filter offers, e.g. each brand or each price preset. */
export function getFilterLinks(filter: CategoryFilter, basePath: string, currency: CurrencyCode): FilterLink[] {
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
                return {
                    value,
                    label: formatRangeLabel(filter, preset.from, preset.to, currency),
                    href: buildFilterHref(basePath, filter.key, value),
                };
            });
    }
}

/** Keeps only query values that match the category's filter definitions. */
export function parseActiveFilters(
    filters: readonly CategoryFilter[],
    search: SearchParamsRecord,
    currency: CurrencyCode,
): ActiveFilter[] {
    return filters.flatMap((filter): ActiveFilter[] => {
        const values = toArray(search[filter.key]);

        switch (filter.type) {
            case "select": {
                const option = filter.options.find((item) => item.value === values[0]);
                return option
                    ? [{ key: filter.key, filterLabel: filter.label, valueLabel: option.label, values: [option.value] }]
                    : [];
            }
            case "multiselect": {
                const selected = filter.options.filter((item) => values.includes(item.value));
                return selected.length > 0
                    ? [
                        {
                            key: filter.key,
                            filterLabel: filter.label,
                            valueLabel: selected.map((item) => item.label).join(", "),
                            values: selected.map((item) => item.value),
                        },
                    ]
                    : [];
            }
            case "range": {
                const range = parseRangeValue(values[0]);
                if (!range) return [];
                return [
                    {
                        key: filter.key,
                        filterLabel: filter.label,
                        valueLabel: formatRangeLabel(filter, range.from, range.to, currency),
                        values: [formatRangeValue(range.from, range.to)],
                    },
                ];
            }
        }
    });
}