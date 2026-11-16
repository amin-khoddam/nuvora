"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Coins, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "../hooks/use-shop-queries";
import { useShopStore } from "../store/shop-store";
import { CURRENCIES, SORT_OPTIONS, isCurrencyCode, isProductSort } from "../types";

const ALL_CATEGORIES = "all";

interface ToolbarMenuProps {
    icon: ReactNode;
    label: string;
    valueLabel: string;
    value: string;
    options: { value: string; label: string }[];
    onValueChange: (value: string) => void;
}

function ToolbarMenu({ icon, label, valueLabel, value, options, onValueChange }: ToolbarMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-full" aria-label={`${label}: ${valueLabel}`}>
                    {icon}
                    <span className="text-muted-foreground">{label}:</span>
                    <span>{valueLabel}</span>
                    <ChevronDown aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
                    {options.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                            {option.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ShopToolbar() {
    const t = useTranslations("shop");
    const { sort, categoryId, currency, setSort, setCategoryId, setCurrency } = useShopStore(
        useShallow((state) => ({
            sort: state.sort,
            categoryId: state.categoryId,
            currency: state.currency,
            setSort: state.setSort,
            setCategoryId: state.setCategoryId,
            setCurrency: state.setCurrency,
        })),
    );
    const { data: categories = [] } = useCategories();

    const categoryOptions = [
        { value: ALL_CATEGORIES, label: t("toolbar.allCategories") },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
    ];
    const activeCategory = categoryOptions.find((option) => option.value === (categoryId ?? ALL_CATEGORIES));

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <ToolbarMenu
                    icon={<ArrowUpDown data-icon="inline-start" aria-hidden />}
                    label={t("toolbar.sort")}
                    valueLabel={t(`sort.${sort}`)}
                    value={sort}
                    options={SORT_OPTIONS.map((option) => ({ value: option, label: t(`sort.${option}`) }))}
                    onValueChange={(value) => isProductSort(value) && setSort(value)}
                />
                <ToolbarMenu
                    icon={<SlidersHorizontal data-icon="inline-start" aria-hidden />}
                    label={t("toolbar.filter")}
                    valueLabel={activeCategory?.label ?? t("toolbar.allCategories")}
                    value={categoryId ?? ALL_CATEGORIES}
                    options={categoryOptions}
                    onValueChange={(value) => setCategoryId(value === ALL_CATEGORIES ? null : value)}
                />
            </div>

            <ToolbarMenu
                icon={<Coins data-icon="inline-start" aria-hidden />}
                label={t("toolbar.currency")}
                valueLabel={currency}
                value={currency}
                options={CURRENCIES.map((code) => ({ value: code, label: t(`currency.${code}`) }))}
                onValueChange={(value) => isCurrencyCode(value) && setCurrency(value)}
            />
        </div>
    );
}