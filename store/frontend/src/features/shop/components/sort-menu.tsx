"use client";

import { useTranslations } from "next-intl";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS, isProductSort, type ProductSort } from "../types";

interface SortMenuProps {
    value: ProductSort;
    onChange: (sort: ProductSort) => void;
}

export function SortMenu({ value, onChange }: SortMenuProps) {
    const t = useTranslations("shop");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    aria-label={`${t("toolbar.sort")}: ${t(`sort.${value}`)}`}
                >
                    <ArrowUpDown data-icon="inline-start" aria-hidden />
                    <span className="hidden text-muted-foreground sm:inline">{t("toolbar.sort")}:</span>
                    <span>{t(`sort.${value}`)}</span>
                    <ChevronDown aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={value} onValueChange={(next) => isProductSort(next) && onChange(next)}>
                    {SORT_OPTIONS.map((option) => (
                        <DropdownMenuRadioItem key={option} value={option}>
                            {t(`sort.${option}`)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}