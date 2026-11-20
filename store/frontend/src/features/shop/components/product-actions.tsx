"use client";

import { useTranslations } from "next-intl";
import { Heart, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_CART_QUANTITY, useShopStore } from "../store/shop-store";

const stepperButtonClassName = "size-10 rounded-full";

interface ProductActionsProps {
    productId: string;
    /** One cart line per seller/color/size combination. */
    cartKey: string;
    /** Stock of the selected combination. */
    stock: number;
}

export function ProductActions({ productId, cartKey, stock }: ProductActionsProps) {
    const t = useTranslations("shop");
    const quantity = useShopStore((state) => state.cart[cartKey] ?? 0);
    const isWishlisted = useShopStore((state) => state.wishlist[productId] === true);
    const toggleWishlist = useShopStore((state) => state.toggleWishlist);
    const addToCart = useShopStore((state) => state.addToCart);
    const setCartQuantity = useShopStore((state) => state.setCartQuantity);

    const maxQuantity = Math.min(MAX_CART_QUANTITY, stock);
    const isOutOfStock = maxQuantity <= 0;
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
                            onClick={() => setCartQuantity(cartKey, 0)}
                        >
                            <Trash2 />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className={stepperButtonClassName}
                            aria-label={t("detail.decrease")}
                            onClick={() => setCartQuantity(cartKey, quantity - 1)}
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
                        disabled={quantity >= maxQuantity}
                        onClick={() => setCartQuantity(cartKey, quantity + 1)}
                    >
                        <Plus />
                    </Button>
                </div>
            ) : (
                <Button
                    size="xl"
                    className="min-w-44 flex-1 rounded-full sm:flex-none"
                    disabled={isOutOfStock}
                    onClick={() => addToCart(cartKey)}
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
                onClick={() => toggleWishlist(productId)}
            >
                <Heart className={cn(isWishlisted && "fill-destructive text-destructive")} />
            </Button>
        </div>
    );
}