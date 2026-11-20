"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCatalog } from "../hooks/use-shop-queries";
import type { CatalogQuery } from "../types";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { EmptyState, QueryError } from "./query-feedback";

const gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] sm:gap-4";
const SKELETON_COUNT = 8;

function SkeletonGrid({ count }: { count: number }) {
    return (
        <ul className={gridClassName} aria-hidden>
            {Array.from({ length: count }, (_, index) => (
                <li key={index}>
                    <ProductCardSkeleton />
                </li>
            ))}
        </ul>
    );
}

/** "48 products". Shares the cache with `CatalogList`, so it costs no extra request. */
export function CatalogCount({ query }: { query: CatalogQuery }) {
    const t = useTranslations("shop.listing");
    const { data, isPending } = useCatalog(query);

    if (isPending) return <Skeleton aria-hidden className="h-5 w-24" />;

    const total = data?.pages[0]?.meta.total ?? 0;
    return (
        <p className="tabular-amount text-sm text-muted-foreground" aria-live="polite">
            {t("results", { count: total, formatted: new Intl.NumberFormat("en-US").format(total) })}
        </p>
    );
}

export function CatalogList({ query }: { query: CatalogQuery }) {
    const t = useTranslations("shop");
    const result = useCatalog(query);

    // Always rendered, so the observer has an element from the first render.
    const sentinelRef = useRef<HTMLDivElement>(null);
    const isNearEnd = useInView(sentinelRef, { margin: "0px 0px 600px 0px" });

    const { hasNextPage, isFetchingNextPage, isFetchNextPageError, isPlaceholderData } = result;
    const loadMore = result.fetchNextPage;

    useEffect(() => {
        if (isNearEnd && hasNextPage && !isFetchingNextPage && !isFetchNextPageError && !isPlaceholderData) {
            void loadMore();
        }
    }, [isNearEnd, hasNextPage, isFetchingNextPage, isFetchNextPageError, isPlaceholderData, loadMore]);

    const products = result.data?.pages.flatMap((page) => page.data) ?? [];

    let body;
    if (result.isPending) {
        body = <SkeletonGrid count={SKELETON_COUNT} />;
    } else if (result.isError && products.length === 0) {
        body = <QueryError error={result.error} onRetry={() => void result.refetch()} />;
    } else if (products.length === 0) {
        body = <EmptyState message={t("listing.empty")} />;
    } else {
        body = (
            <>
                <ul className={cn(gridClassName, "transition-opacity", isPlaceholderData && "opacity-60")}>
                    {products.map((product, index) => (
                        <li key={product.id}>
                            <ProductCard product={product} showDiscountBadge isAboveFold={index < 4} />
                        </li>
                    ))}
                </ul>

                {isFetchingNextPage ? <SkeletonGrid count={4} /> : null}

                {isFetchNextPageError ? (
                    <div className="flex flex-col items-center gap-2 py-4 text-sm text-muted-foreground">
                        <p>{t("listing.loadMoreError")}</p>
                        <Button variant="outline" size="sm" onClick={() => void loadMore()}>
                            {t("listing.retry")}
                        </Button>
                    </div>
                ) : null}

                {hasNextPage === false ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">{t("listing.end")}</p>
                ) : null}
            </>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {body}
            <div ref={sentinelRef} aria-hidden />
        </div>
    );
}