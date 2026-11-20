"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { RangeSlider } from "@/components/ui/range-slider";
import { cn } from "@/lib/utils";
import { formatFilterNumber, formatRangeLabel, formatRangeValue, parseRangeValue } from "../lib/filter-query";
import { useShopStore } from "../store/shop-store";
import type { CategoryFilter, CurrencyCode, FilterOption, RangeFilter } from "../types";

interface ShopFiltersProps {
    filters: CategoryFilter[];
    /** Filter key → selected values, as validated from the URL. */
    values: Record<string, string[]>;
    onChange: (key: string, values: string[]) => void;
}

const chipClassName =
    "rounded-full border px-3 py-1 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring";

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            <h3 className="text-sm font-semibold">{title}</h3>
            {children}
        </section>
    );
}

function SelectControl({
                           options,
                           selected,
                           onChange,
                       }: {
    options: FilterOption[];
    selected: string | undefined;
    onChange: (values: string[]) => void;
}) {
    return (
        <ul className="flex flex-wrap gap-2">
            {options.map((option) => {
                const isSelected = option.value === selected;

                return (
                    <li key={option.value}>
                        <button
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => onChange(isSelected ? [] : [option.value])}
                            className={cn(
                                chipClassName,
                                isSelected
                                    ? "border-brand bg-brand/10 text-brand"
                                    : "border-border/70 text-muted-foreground hover:border-brand/40 hover:text-foreground",
                            )}
                        >
                            {option.label}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

function MultiSelectControl({
                                options,
                                selected,
                                onChange,
                            }: {
    options: FilterOption[];
    selected: string[];
    onChange: (values: string[]) => void;
}) {
    return (
        <ul className="flex flex-col gap-1">
            {options.map((option) => {
                const isChecked = selected.includes(option.value);

                return (
                    <li key={option.value}>
                        <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                    onChange(isChecked ? selected.filter((value) => value !== option.value) : [...selected, option.value])
                                }
                                className="size-4 rounded accent-brand"
                            />
                            {option.label}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}

function RangeControl({
                          filter,
                          value,
                          currency,
                          onChange,
                      }: {
    filter: RangeFilter;
    value: string | undefined;
    currency: CurrencyCode;
    onChange: (values: string[]) => void;
}) {
    const t = useTranslations("shop.listing");
    const parsed = parseRangeValue(value);
    // Local while dragging; the URL is only written when the thumb is released.
    const [draft, setDraft] = useState<[number, number]>([
        Math.max(filter.min, parsed?.from ?? filter.min),
        Math.min(filter.max, parsed?.to ?? filter.max),
    ]);

    function commit([from, to]: [number, number]) {
        onChange(from <= filter.min && to >= filter.max ? [] : [formatRangeValue(from, to)]);
    }

    return (
        <div className="flex flex-col gap-4">
            <RangeSlider
                min={filter.min}
                max={filter.max}
                step={filter.step}
                value={draft}
                onValueChange={setDraft}
                onValueCommit={commit}
                thumbLabels={[t("minimum"), t("maximum")]}
            />
            <div className="tabular-amount flex items-center justify-between text-xs font-medium">
                <span>{formatFilterNumber(filter, draft[0], currency)}</span>
                <span>{formatFilterNumber(filter, draft[1], currency)}</span>
            </div>

            {filter.presets.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                    {filter.presets.map((preset) => {
                        const presetValue = formatRangeValue(preset.from, preset.to);
                        const isSelected = presetValue === value;

                        return (
                            <li key={presetValue}>
                                <button
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => onChange(isSelected ? [] : [presetValue])}
                                    className={cn(
                                        chipClassName,
                                        "tabular-amount text-xs",
                                        isSelected
                                            ? "border-brand bg-brand/10 text-brand"
                                            : "border-border/70 text-muted-foreground hover:border-brand/40 hover:text-foreground",
                                    )}
                                >
                                    {formatRangeLabel(filter, preset.from, preset.to, currency)}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}

/** Renders any filter from data: select, multiselect and range. Used by the sidebar and the mobile sheet. */
export function ShopFilters({ filters, values, onChange }: ShopFiltersProps) {
    const currency = useShopStore((state) => state.currency);

    return (
        <div className="flex flex-col divide-y divide-border/70">
            {filters.map((filter) => {
                const selected = values[filter.key] ?? [];
                const handleChange = (next: string[]) => onChange(filter.key, next);

                return (
                    <FilterGroup key={filter.key} title={filter.label}>
                        {filter.type === "select" ? (
                            <SelectControl options={filter.options} selected={selected[0]} onChange={handleChange} />
                        ) : null}
                        {filter.type === "multiselect" ? (
                            <MultiSelectControl options={filter.options} selected={selected} onChange={handleChange} />
                        ) : null}
                        {filter.type === "range" ? (
                            <RangeControl
                                // Remounts when the URL value or the bounds (currency) change, resetting the draft.
                                key={`${selected[0] ?? ""}:${filter.min}-${filter.max}`}
                                filter={filter}
                                value={selected[0]}
                                currency={currency}
                                onChange={handleChange}
                            />
                        ) : null}
                    </FilterGroup>
                );
            })}
        </div>
    );
}