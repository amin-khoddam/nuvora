"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { shopRoutes } from "@/config/shop";
import { useCategories } from "../hooks/use-shop-queries";
import { CategorySlider } from "./category-slider";
import { EmptyState, QueryError } from "./query-feedback";
import { SectionHeader } from "./section-header";

const SKELETON_COUNT = 8;

export function CategoryGrid({ title }: { title: string }) {
    const t = useTranslations("shop.states");
    const { data: categories, isPending, isError, error, refetch } = useCategories();

    let body;
    if (isPending) {
        body = (
            <ul className="flex gap-3 overflow-hidden" aria-hidden>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index} className="min-w-24 flex-1 basis-24">
                        <Skeleton className="h-28 rounded-2xl" />
                    </li>
                ))}
            </ul>
        );
    } else if (isError) {
        body = <QueryError error={error} onRetry={() => void refetch()} />;
    } else if (categories.length === 0) {
        body = <EmptyState message={t("empty")} />;
    } else {
        body = <CategorySlider categories={categories} getHref={(category) => shopRoutes.category(category.slug)} />;
    }

    return (
        <section aria-label={title}>
            <SectionHeader title={title} href={shopRoutes.shop} />
            {body}
        </section>
    );
}