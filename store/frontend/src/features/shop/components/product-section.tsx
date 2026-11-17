"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { shopRoutes } from "@/config/shop";
import { cn } from "@/lib/utils";
import { useProducts } from "../hooks/use-shop-queries";
import { useShopStore } from "../store/shop-store";
import type { ProductCollection } from "../types";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { EmptyState, QueryError } from "./query-feedback";
import { SectionHeader } from "./section-header";

const SKELETON_COUNT = 4;

interface ProductSectionProps {
    title: string;
    collection: ProductCollection;
    showDiscountBadge?: boolean;
    /** Hides one product, e.g. the one whose detail page the section is shown on. */
    excludeId?: string;
}

function ProductGrid({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <ul
            className={cn(
                "grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4 transition-opacity",
                className,
            )}
        >
            {children}
        </ul>
    );
}

export function ProductSection({
                                   title,
                                   collection,
                                   showDiscountBadge = false,
                                   excludeId,
                               }: ProductSectionProps) {
    const t = useTranslations("shop.states");
    const { sort, categoryId, currency } = useShopStore(
        useShallow((state) => ({
            sort: state.sort,
            categoryId: state.categoryId,
            currency: state.currency,
        })),
    );
    const {
        data: products,
        isPending,
        isError,
        error,
        refetch,
        isPlaceholderData,
    } = useProducts({ collection, sort, category: categoryId, currency });

    const visibleProducts = excludeId ? products?.filter((product) => product.id !== excludeId) : products;

    let body;
    if (isPending) {
        body = (
            <ProductGrid>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index}>
                        <ProductCardSkeleton />
                    </li>
                ))}
            </ProductGrid>
        );
    } else if (isError) {
        body = <QueryError error={error} onRetry={() => void refetch()} />;
    } else if (!visibleProducts || visibleProducts.length === 0) {
        body = <EmptyState message={t("empty")} />;
    } else {
        body = (
            <ProductGrid className={cn(isPlaceholderData && "opacity-60")}>
                {visibleProducts.map((product) => (
                    <li key={product.id}>
                        <ProductCard product={product} showDiscountBadge={showDiscountBadge} />
                    </li>
                ))}
            </ProductGrid>
        );
    }

    return (
        <section aria-label={title}>
            <SectionHeader title={title} href={shopRoutes.collection(collection)} />
            {body}
        </section>
    );
}