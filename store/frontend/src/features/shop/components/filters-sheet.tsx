"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import type { CategoryFilter } from "../types";
import { ShopFilters } from "./shop-filters";

interface FiltersSheetProps {
    filters: CategoryFilter[];
    values: Record<string, string[]>;
    activeCount: number;
    onChange: (key: string, values: string[]) => void;
    onClear: () => void;
}

/** Below `lg` the filter sidebar becomes this full-screen sheet, like the category explorer. */
export function FiltersSheet({ filters, values, activeCount, onChange, onClear }: FiltersSheetProps) {
    const t = useTranslations("shop.listing");
    const tCommon = useTranslations("common");

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="outline" size="lg" className="rounded-full lg:hidden">
                    <SlidersHorizontal data-icon="inline-start" aria-hidden />
                    {t("filters")}
                    {activeCount > 0 ? (
                        <span className="tabular-amount grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.7rem] leading-5 font-semibold text-primary-foreground">
              {activeCount}
            </span>
                    ) : null}
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 border-b border-border/70 px-3 py-3">
                        <Dialog.Title className="flex-1 ps-1 font-display text-lg font-semibold">{t("filters")}</Dialog.Title>
                        {activeCount > 0 ? (
                            <Button variant="ghost" size="sm" className="rounded-full" onClick={onClear}>
                                {t("clearAll")}
                            </Button>
                        ) : null}
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={tCommon("close")}>
                                <X />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">{t("filtersDescription")}</Dialog.Description>

                    <div className="flex-1 overflow-y-auto p-4">
                        <ShopFilters filters={filters} values={values} onChange={onChange} />
                    </div>

                    <div className="border-t border-border/70 p-3">
                        <Dialog.Close asChild>
                            <Button size="xl" className="w-full rounded-full">
                                {t("showResults")}
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}