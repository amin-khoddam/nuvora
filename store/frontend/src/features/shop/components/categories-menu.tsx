"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCategoryNavigation } from "../hooks/use-category-navigation";
import { useCategories } from "../hooks/use-shop-queries";
import type { Category } from "../types";
import { CategoryPanel } from "./category-panel";
import { CategoryQueryState } from "./category-query-state";

const NO_CATEGORIES: Category[] = [];

/**
 * Desktop mega menu. Sidebar = top-level categories (hover or focus switches
 * the panel); the panel drills into children, so every level, not only the
 * top one, can be entered or opened as a page via "View all".
 */
export function CategoriesMenu() {
    const t = useTranslations("shop");
    const tMenu = useTranslations("shop.categoryMenu");
    const tCommon = useTranslations("common");
    const [open, setOpen] = useState(false);
    const { data: roots = NO_CATEGORIES, isPending, isError, error, refetch } = useCategories();
    const { path, drill, popTo, showRoot, reset } = useCategoryNavigation(roots);

    const isReady = !isPending && !isError && roots.length > 0;
    // Before the first hover the first top-level category is shown.
    const view = path.length > 0 ? path : roots.slice(0, 1);
    const activeRoot = view[0];

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (!next) reset();
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={t("nav.categories")}>
                    <LayoutGrid />
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto rounded-b-3xl border-b border-border bg-popover text-popover-foreground shadow-[var(--elevation-elevated)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4">
                    <div className="container-page py-5">
                        <div className="mb-4 flex items-center justify-between">
                            <Dialog.Title className="font-display text-lg font-semibold">{t("nav.categories")}</Dialog.Title>
                            <Dialog.Close asChild>
                                <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={tCommon("close")}>
                                    <X />
                                </Button>
                            </Dialog.Close>
                        </div>
                        <Dialog.Description className="sr-only">{t("nav.categoriesDescription")}</Dialog.Description>

                        {isReady ? (
                            <div className="grid min-h-80 grid-cols-[15rem_1fr] gap-8">
                                <nav aria-label={tMenu("topLevel")} className="border-e border-border/70 pe-4">
                                    <ul className="flex flex-col gap-1">
                                        {roots.map((root) => {
                                            const isActive = activeRoot?.id === root.id;

                                            return (
                                                <li key={root.id}>
                                                    <button
                                                        type="button"
                                                        aria-current={isActive || undefined}
                                                        onMouseEnter={() => showRoot(root)}
                                                        onFocus={() => showRoot(root)}
                                                        onClick={() => (isActive ? popTo(1) : showRoot(root))}
                                                        className={cn(
                                                            "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring",
                                                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60",
                                                        )}
                                                    >
                                                        {root.name}
                                                        <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </nav>

                                <CategoryPanel
                                    path={view}
                                    items={view.at(-1)?.children ?? NO_CATEGORIES}
                                    layout="grid"
                                    onCrumbSelect={popTo}
                                    onDrill={drill}
                                    onNavigate={() => handleOpenChange(false)}
                                />
                            </div>
                        ) : (
                            <CategoryQueryState
                                isPending={isPending}
                                isError={isError}
                                error={error}
                                onRetry={() => void refetch()}
                            />
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}