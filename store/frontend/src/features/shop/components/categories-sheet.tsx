"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { shopRoutes } from "@/config/shop";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";
import { EmptyState, QueryError } from "./query-feedback";

const SKELETON_COUNT = 6;

/**
 * Full-screen category page for mobile. For ,now it is a flat list; the
 * recursive Category Explorer (mega menu task) will replace the body.
 */
export function CategoriesSheet() {
    const t = useTranslations("shop");
    const tCommon = useTranslations("common");
    const { data: categories, isPending, isError, error, refetch } = useCategories();

    let body;
    if (isPending) {
        body = (
            <ul aria-hidden className="flex flex-col gap-2 p-3">
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index}>
                        <Skeleton className="h-18 rounded-2xl" />
                    </li>
                ))}
            </ul>
        );
    } else if (isError) {
        body = (
            <div className="p-3">
                <QueryError error={error} onRetry={() => void refetch()} />
            </div>
        );
    } else if (categories.length === 0) {
        body = (
            <div className="p-3">
                <EmptyState message={t("states.empty")} />
            </div>
        );
    } else {
        body = (
            <ul className="flex flex-col gap-1 p-3">
                {categories.map((category) => (
                    <li key={category.id}>
                        <Dialog.Close asChild>
                            <Link
                                href={shopRoutes.category(category.slug)}
                                className="flex items-center gap-3 rounded-2xl p-3 outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
                            >
                <span className="relative size-12 shrink-0">
                  <Image src={category.image} alt="" fill sizes="48px" className="object-contain" />
                </span>
                                <span className="flex-1 text-base font-medium">{category.name}</span>
                                <ChevronRight className="size-5 text-muted-foreground rtl:-scale-x-100" aria-hidden />
                            </Link>
                        </Dialog.Close>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={t("nav.categories")}>
                    <LayoutGrid />
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4">
                    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                        <Dialog.Title className="font-display text-lg font-semibold">{t("nav.categories")}</Dialog.Title>
                        <Dialog.Close asChild>
                            <Button variant="ghost" size="icon-lg" className="size-10 rounded-full" aria-label={tCommon("close")}>
                                <X />
                            </Button>
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="sr-only">{t("nav.categoriesDescription")}</Dialog.Description>

                    <div className="flex-1 overflow-y-auto">{body}</div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}