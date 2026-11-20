"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { ActiveFilter } from "../lib/filter-query";

interface ActiveFilterChipsProps {
    filters: ActiveFilter[];
    onRemove: (key: string) => void;
    onClear: () => void;
}

export function ActiveFilterChips({ filters, onRemove, onClear }: ActiveFilterChipsProps) {
    const t = useTranslations("shop.listing");

    if (filters.length === 0) return null;

    return (
        <section aria-label={t("activeFilters")} className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    type="button"
                    aria-label={t("removeFilter", { name: filter.filterLabel })}
                    onClick={() => onRemove(filter.key)}
                    className="tabular-amount inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand outline-none transition-colors hover:bg-brand/15 focus-visible:ring-3 focus-visible:ring-ring"
                >
                    {filter.filterLabel}: {filter.valueLabel}
                    <X className="size-3.5" aria-hidden />
                </button>
            ))}
            <button
                type="button"
                onClick={onClear}
                className="rounded-md text-sm text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
            >
                {t("clearAll")}
            </button>
        </section>
    );
}