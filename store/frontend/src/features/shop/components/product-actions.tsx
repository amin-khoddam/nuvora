"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopStore } from "../store/shop-store";
import type { ProductDetail } from "../types";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export function ProductActions({ product }: { product: ProductDetail }) {
    const t = useTranslations("shop");
    const [quantity, setQuantity] = useState(MIN_QUANTITY);
    const isWishlisted = useShopStore((state) => state.wishlist.includes(product.id));
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);
    const addToCart = useShopStore((state) => state.addToCart);

    const isOutOfStock = product.stockStatus === "outOfStock";

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div
                role="group"
                aria-label={t("detail.quantity")}
                className="flex items-center gap-1 rounded-full border border-border/70 p-0.5"
            >
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="size-10 rounded-full"
                    aria-label={t("detail.decrease")}
                    disabled={isOutOfStock || quantity <= MIN_QUANTITY}
                    onClick={() => setQuantity((value) => Math.max(MIN_QUANTITY, value - 1))}
                >
                    <Minus />
                </Button>
                <output aria-live="polite" className="tabular-amount w-8 text-center text-sm font-medium">
                    {quantity}
                </output>
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="size-10 rounded-full"
                    aria-label={t("detail.increase")}
                    disabled={isOutOfStock || quantity >= MAX_QUANTITY}
                    onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY, value + 1))}
                >
                    <Plus />
                </Button>
            </div>

            <Button
                size="xl"
                className="min-w-44 flex-1 rounded-full sm:flex-none"
                disabled={isOutOfStock}
                onClick={() => addToCart(product.id, quantity)}
            >
                <ShoppingCart data-icon="inline-start" aria-hidden />
                {t("product.addToCart")}
            </Button>

            <Button
                variant="outline"
                size="icon-lg"
                className="size-11 rounded-full"
                aria-pressed={isWishlisted}
                aria-label={isWishlisted ? t("product.removeFromWishlist") : t("product.addToWishlist")}
                onClick={() => toggleWishlist(product.id)}
            >
                <Heart className={cn(isWishlisted && "fill-destructive text-destructive")} />
            </Button>
        </div>
    );
}