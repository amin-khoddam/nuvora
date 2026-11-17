"use client";

import { useTranslations } from "next-intl";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_CART_QUANTITY, useShopStore } from "../store/shop-store";
import type { ProductDetail } from "../types";

const stepperButtonClassName = "size-10 rounded-full";

export function ProductActions({ product }: { product: ProductDetail }) {
    const t = useTranslations("shop");
    const quantity = useShopStore((state) => state.cart[product.id] ?? 0);
    const isWishlisted = useShopStore((state) => state.wishlist.includes(product.id));
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);
    const addToCart = useShopStore((state) => state.addToCart);
    const setCartQuantity = useShopStore((state) => state.setCartQuantity);

    const isOutOfStock = product.stockStatus === "outOfStock";
    const isInCart = quantity > 0;

    return (
        <div className="flex flex-wrap items-center gap-3">
            {isInCart ? (
                <div
                    role="group"
                    aria-label={t("detail.quantity")}
                    className="flex min-w-44 items-center justify-between rounded-full border border-border/70 p-px"
                >
                    {quantity === 1 ? (
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className={cn(stepperButtonClassName, "text-destructive hover:text-destructive")}
                            aria-label={t("detail.removeFromCart")}
                            onClick={() => setCartQuantity(product.id, 0)}
                        >
                            <Trash2 />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className={stepperButtonClassName}
                            aria-label={t("detail.decrease")}
                            onClick={() => setCartQuantity(product.id, quantity - 1)}
                        >
                            <Minus />
                        </Button>
                    )}

                    <output aria-live="polite" className="tabular-amount w-8 text-center text-sm font-medium">
                        {quantity}
                    </output>

                    <Button
                        variant="ghost"
                        size="icon-lg"
                        className={stepperButtonClassName}
                        aria-label={t("detail.increase")}
                        disabled={quantity >= MAX_CART_QUANTITY}
                        onClick={() => setCartQuantity(product.id, quantity + 1)}
                    >
                        <Plus />
                    </Button>
                </div>
            ) : (
                <Button
                    size="xl"
                    className="min-w-44 flex-1 rounded-full sm:flex-none"
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                >
                    <ShoppingCart data-icon="inline-start" aria-hidden />
                    {t("product.addToCart")}
                </Button>
            )}

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