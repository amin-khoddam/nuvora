"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectCartCount, useShopStore } from "@/features/shop/store/shop-store";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface UserActionProps {
    className?: string;
}

export function AccountLink({ className }: UserActionProps) {
    const t = useTranslations("shop.nav");

    return (
        <Button asChild variant="ghost" size="icon-lg" className={cn("size-10 rounded-full", className)}>
            <Link href="/account" aria-label={t("account")}>
                <User />
            </Link>
        </Button>
    );
}

export function CartLink({ className }: UserActionProps) {
    const t = useTranslations("shop.nav");
    const cartCount = useShopStore(selectCartCount);

    return (
        <Button asChild variant="ghost" size="icon-lg" className={cn("relative size-10 rounded-full", className)}>
            <Link href="/cart" aria-label={t("cart")}>
                <ShoppingCart />
                {cartCount > 0 ? (
                    <span className="tabular-amount absolute end-0 top-0 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.65rem] leading-4 font-semibold text-primary-foreground">
            {cartCount}
          </span>
                ) : null}
            </Link>
        </Button>
    );
}