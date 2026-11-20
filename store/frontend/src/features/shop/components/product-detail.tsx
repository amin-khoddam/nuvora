"use client";

import { useTranslations } from "next-intl";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { isNotFoundError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { useVariantSelection } from "../hooks/use-variant-selection";
import { useCategories, useProduct } from "../hooks/use-shop-queries";
import { findPathById, getCategoryHref } from "../lib/category-tree";
import { formatCompactNumber, formatPrice } from "../lib/format";
import { getDiscountPercent, getStockStatus } from "../lib/variants";
import { useShopStore } from "../store/shop-store";
import type { ProductDetail as ProductDetailData, StockStatus } from "../types";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { ProductActions } from "./product-actions";
import { ProductGallery } from "./product-gallery";
import { ProductSection } from "./product-section";
import { ProductSpecs } from "./product-specs";
import { QueryError } from "./query-feedback";
import { ColorPicker, SellerPicker, SizePicker } from "./variant-selectors";

const STOCK_CLASS_NAMES: Record<StockStatus, string> = {
    inStock: "text-success",
    lowStock: "text-amber-600 dark:text-amber-400",
    outOfStock: "text-destructive",
};

function ProductDetailSkeleton() {
    return (
        <div aria-hidden className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <Skeleton className="aspect-square rounded-2xl sm:max-w-[500px]" />
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

/** Mounted per product (`key`), so the seller/color/size choice resets on navigation. */
function ProductView({ product }: { product: ProductDetailData }) {
    const t = useTranslations("shop");
    const { data: categories = [] } = useCategories();
    const { variant, selectSeller, selectColor, selectSize } = useVariantSelection(product.sellers);
    const { seller, color, size, offer } = variant;

    const price = offer?.price ?? product.price;
    const compareAtPrice = offer ? offer.compareAtPrice : product.compareAtPrice;
    const discountPercent = getDiscountPercent(price, compareAtPrice);
    const stock = offer?.stock ?? 0;
    const stockStatus = getStockStatus(stock);

    const categoryPath = findPathById(categories, product.categoryId) ?? [];
    const breadcrumbs: BreadcrumbItem[] = [
        { label: siteConfig.name, href: shopRoutes.home },
        ...categoryPath.map((category, index) => ({
            label: category.name,
            href: getCategoryHref(categoryPath.slice(0, index + 1)),
        })),
        { label: product.name },
    ];

    return (
        <article className="flex flex-col gap-10 sm:gap-12">
            <Breadcrumbs items={breadcrumbs} />

            <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
                <ProductGallery images={product.gallery} alt={product.name} />

                <div className="flex flex-col gap-5">
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
                        <span className="text-3xl font-bold">{formatPrice(price, product.currency)}</span>
                        {compareAtPrice !== null ? (
                            <span className="text-base text-muted-foreground line-through">
                {formatPrice(compareAtPrice, product.currency)}
              </span>
                        ) : null}
                        {discountPercent !== null ? (
                            <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                -{discountPercent}%
              </span>
                        ) : null}
                    </p>

                    <p className={cn("text-sm font-medium", STOCK_CLASS_NAMES[stockStatus])}>
                        {t(`detail.stock.${stockStatus}`)}
                    </p>

                    <div className="flex flex-col gap-5 border-t border-border/70 pt-5">
                        {product.sellers.length > 1 ? (
                            <SellerPicker
                                sellers={product.sellers}
                                selectedId={seller?.id}
                                currency={product.currency}
                                onSelect={selectSeller}
                            />
                        ) : seller ? (
                            <p className="text-sm text-muted-foreground">
                                {t("detail.soldBy")} <span className="font-medium text-foreground">{seller.name}</span>
                            </p>
                        ) : null}

                        {seller ? <ColorPicker colors={seller.colors} selectedId={color?.id} onSelect={selectColor} /> : null}

                        {color && color.sizes.length > 0 ? (
                            <SizePicker sizes={color.sizes} selectedId={size?.id} onSelect={selectSize} />
                        ) : null}
                    </div>

                    <ProductActions productId={product.id} cartKey={`${product.id}:${variant.key}`} stock={stock} />

                    <div className="flex flex-col gap-4 border-t border-border/70 pt-5">
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
                    </div>
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

export function ProductDetail({ slug }: { slug: string }) {
    const currency = useShopStore((state) => state.currency);
    const { data: product, isPending, isError, error, refetch } = useProduct(slug, currency);

    if (isPending) return <ProductDetailSkeleton />;
    if (isError) {
        return isNotFoundError(error) ? (
            <ProductNotFound />
        ) : (
            <QueryError error={error} onRetry={() => void refetch()} />
        );
    }

    return <ProductView key={product.id} product={product} />;
}