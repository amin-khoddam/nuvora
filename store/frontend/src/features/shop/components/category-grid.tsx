"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";
import { EmptyState, QueryError } from "./query-feedback";
import { SectionHeader } from "./section-header";

const SKELETON_COUNT = 8;
const itemClassName = "min-w-28 flex-1 basis-28 snap-start";

export function CategoryGrid({ title }: { title: string }) {
    const t = useTranslations("shop.states");
    const { data: categories, isPending, isError, error, refetch } = useCategories();

    let body;
    if (isPending) {
        body = (
            <ul className="flex gap-3" aria-hidden>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index} className={itemClassName}>
                        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
                    </li>
                ))}
            </ul>
        );
    } else if (isError) {
        body = <QueryError error={error} onRetry={() => void refetch()} />;
    } else if (categories.length === 0) {
        body = <EmptyState message={t("empty")} />;
    } else {
        body = (
            <ul className="flex snap-x gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <li key={category.id} className={itemClassName}>
                        <Link
                            href={shopRoutes.category(category.slug)}
                            className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
                        >
                            <Surface padding="none" interactive className="flex h-full flex-col items-center gap-2 p-3">
                <span className="relative size-16">
                  <Image src={category.image} alt="" fill sizes="64px" className="object-contain" />
                </span>
                                <span className="text-center text-sm font-medium">{category.name}</span>
                            </Surface>
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section aria-label={title}>
            <SectionHeader title={title} href={shopRoutes.categories} />
            {body}
        </section>
    );
}