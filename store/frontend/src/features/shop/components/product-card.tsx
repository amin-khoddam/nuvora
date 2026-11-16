"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { formatCompactNumber, formatPrice } from "../lib/format";
import { useShopStore } from "../store/shop-store";
import type { Product } from "../types";

interface ProductCardProps {
    product: Product;
    /** Shows the "-15%" badge. On for Featured, off for New Arrivals. */
    showDiscountBadge?: boolean;
}

export function ProductCard({ product, showDiscountBadge = false }: ProductCardProps) {
    const t = useTranslations("shop.product");
    const isWishlisted = useShopStore((state) => state.wishlist.includes(product.id));
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);
    const addToCart = useShopStore((state) => state.addToCart);

    return (
        <Surface padding="sm" interactive className="relative flex h-full flex-col">
            {showDiscountBadge && product.discountPercent !== null ? (
                <span className="tabular-amount absolute start-4 top-4 z-10 rounded-full bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
          -{product.discountPercent}%
        </span>
            ) : null}

            <Button
                variant="ghost"
                size="icon-sm"
                className="absolute end-3 top-3 z-10 rounded-full text-muted-foreground"
                aria-pressed={isWishlisted}
                aria-label={isWishlisted ? t("removeFromWishlist") : t("addToWishlist")}
                onClick={() => toggleWishlist(product.id)}
            >
                <Heart className={cn(isWishlisted && "fill-destructive text-destructive")} />
            </Button>

            <div className="relative aspect-[4/3] w-full">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-3"
                />
            </div>

            <h3 className="mt-3 truncate font-sans text-sm font-medium">{product.name}</h3>

            <div className="mt-1 flex items-end justify-between gap-2">
                <div>
                    <p className="tabular-amount flex items-baseline gap-2">
                        <span className="text-base font-semibold">{formatPrice(product.price, product.currency)}</span>
                        {product.compareAtPrice !== null ? (
                            <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
                        ) : null}
                    </p>

                    <p className="tabular-amount mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
                        <span aria-hidden>
              {product.rating.toFixed(1)} ({formatCompactNumber(product.reviewCount)})
            </span>
                        <span className="sr-only">
              {t("ratingLabel", { rating: product.rating.toFixed(1), count: product.reviewCount })}
            </span>
                    </p>
                </div>

                <Button
                    variant="secondary"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label={t("addToCart")}
                    onClick={() => addToCart(product.id)}
                >
                    <ShoppingCart />
                </Button>
            </div>
        </Surface>
    );
}

export function ProductCardSkeleton() {
    return <div aria-hidden className="h-64 animate-pulse rounded-2xl bg-muted" />;
}