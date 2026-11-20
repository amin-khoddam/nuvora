"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, LayoutGrid, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { useCategoryNavigation } from "../hooks/use-category-navigation";
import { useCategories } from "../hooks/use-shop-queries";
import type { Category } from "../types";
import { CategoryPanel } from "./category-panel";
import { CategoryQueryState } from "./category-query-state";

const NO_CATEGORIES: Category[] = [];

/** Full-screen, click-based explorer with Back, Close and breadcrumbs; depth is unlimited. */
export function CategoriesSheet() {
    const t = useTranslations("shop");
    const tMenu = useTranslations("shop.categoryMenu");
    const tCommon = useTranslations("common");
    const [open, setOpen] = useState(false);
    const { data: roots = NO_CATEGORIES, isPending, isError, error, refetch } = useCategories();
    const { path, drill, popTo, reset } = useCategoryNavigation(roots);

    const isReady = !isPending && !isError && roots.length > 0;
    const current = path.at(-1);

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
                <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4">
                    <div className="flex items-center gap-2 border-b border-border/70 px-3 py-3">
                        {path.length > 0 ? (
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                className="size-10 rounded-full"
                                aria-label={tMenu("back")}
                                onClick={() => popTo(path.length - 1)}
                            >
                                <ArrowLeft className="rtl:-scale-x-100" />
                            </Button>
                        ) : null}
                        <Dialog.Title className="flex-1 truncate ps-1 font-display text-lg font-semibold">
                            {current?.name ?? t("nav.categories")}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={tCommon("close")}>
                                <X />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">{t("nav.categoriesDescription")}</Dialog.Description>

                    <div className="flex-1 overflow-y-auto p-4">
                        {isReady ? (
                            <CategoryPanel
                                path={path}
                                items={current?.children ?? roots}
                                layout="list"
                                rootLabel={t("nav.categories")}
                                onCrumbSelect={popTo}
                                onDrill={drill}
                                onNavigate={() => handleOpenChange(false)}
                            />
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