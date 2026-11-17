"use client";

import { useTranslations } from "next-intl";
import { Check, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { Link } from "@/i18n/navigation";
import { isNotFoundError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPrice } from "../lib/format";
import { useCategories, useProduct } from "../hooks/use-shop-queries";
import { useShopStore } from "../store/shop-store";
import type { StockStatus } from "../types";
import { ProductActions } from "./product-actions";
import { ProductGallery } from "./product-gallery";
import { ProductSection } from "./product-section";
import { ProductSpecs } from "./product-specs";
import { QueryError } from "./query-feedback";

const STOCK_CLASS_NAMES: Record<StockStatus, string> = {
    inStock: "text-success",
    lowStock: "text-amber-600 dark:text-amber-400",
    outOfStock: "text-destructive",
};

function Breadcrumb({ name }: { name: string }) {
    const t = useTranslations("shop");

    return (
        <nav aria-label={t("detail.breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <li>
                    <Link href={shopRoutes.home} className="transition-colors hover:text-foreground">
                        {t("nav.home")}
                    </Link>
                </li>
                <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
                <li>
                    <Link href={shopRoutes.shop} className="transition-colors hover:text-foreground">
                        {t("nav.shop")}
                    </Link>
                </li>
                <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />
                <li aria-current="page" className="max-w-full truncate font-medium text-foreground">
                    {name}
                </li>
            </ol>
        </nav>
    );
}

function ProductDetailSkeleton() {
    return (
        <div aria-hidden className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-32" />
            </div>
        </div>
    );
}

function ProductNotFound() {
    const t = useTranslations("shop");

    return (
        <Surface role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
            <h1 className="font-display text-2xl font-semibold">{t("detail.notFoundTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("states.errors.notFound")}</p>
            <Button asChild variant="outline" className="mt-2 rounded-full">
                <Link href={shopRoutes.shop}>{t("detail.backToShop")}</Link>
            </Button>
        </Surface>
    );
}

export function ProductDetail({ slug }: { slug: string }) {
    const t = useTranslations("shop");
    const currency = useShopStore((state) => state.currency);
    const { data: product, isPending, isError, error, refetch } = useProduct(slug, currency);
    const { data: categories = [] } = useCategories();

    if (isPending) return <ProductDetailSkeleton />;
    if (isError) {
        return isNotFoundError(error) ? (
            <ProductNotFound />
        ) : (
            <QueryError error={error} onRetry={() => void refetch()} />
        );
    }

    const categoryName = categories.find((category) => category.id === product.categoryId)?.name;

    return (
        <article className="flex flex-col gap-10 sm:gap-12">
            <Breadcrumb name={product.name} />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                <ProductGallery key={product.id} images={product.gallery} alt={product.name} />

                <div className="flex flex-col gap-5">
                    {categoryName ? <p className="text-sm font-medium text-brand">{categoryName}</p> : null}

                    <h1 className="font-display text-3xl font-bold text-balance sm:text-4xl">{product.name}</h1>

                    <p className="tabular-amount flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                        <span aria-hidden>
              {product.rating.toFixed(1)} ({formatCompactNumber(product.reviewCount)})
            </span>
                        <span className="sr-only">
              {t("product.ratingLabel", { rating: product.rating.toFixed(1), count: product.reviewCount })}
            </span>
                    </p>

                    <p className="tabular-amount flex flex-wrap items-baseline gap-3">
                        <span className="text-3xl font-bold">{formatPrice(product.price, product.currency)}</span>
                        {product.compareAtPrice !== null ? (
                            <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
                        ) : null}
                        {product.discountPercent !== null ? (
                            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                -{product.discountPercent}%
              </span>
                        ) : null}
                    </p>

                    <p className={cn("text-sm font-medium", STOCK_CLASS_NAMES[product.stockStatus])}>
                        {t(`detail.stock.${product.stockStatus}`)}
                    </p>

                    <p className="leading-relaxed text-muted-foreground">{product.description}</p>

                    {product.highlights.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {product.highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-2 text-sm">
                                    <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    ) : null}

                    <ProductActions product={product} />
                </div>
            </div>

            <ProductSpecs specs={product.specs} />

            <ProductSection
                title={t("detail.related")}
                collection="featured"
                excludeId={product.id}
                showDiscountBadge
            />
        </article>
    );
}