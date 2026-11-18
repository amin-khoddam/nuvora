"use client";

import { useTranslations } from "next-intl";
import { CategoriesSheet } from "@/features/shop/components/categories-sheet";
import { CurrencyMenu } from "@/features/shop/components/currency-menu";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { AccountLink, CartLink } from "./user-actions";

/**
 * Fixed bar for mobile and tablet. Height (4rem) is mirrored by the bottom
 * padding on `body` in the root layout; change both together.
 */
export function BottomNav() {
    const t = useTranslations("shop.nav");

    return (
        <nav
            aria-label={t("bottomNavigation")}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
        >
            <ul className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
                <li>
                    <AccountLink />
                </li>
                <li>
                    <CartLink />
                </li>
                <li>
                    <CurrencyMenu compact />
                </li>
                <li>
                    <ThemeToggle />
                </li>
                <li>
                    <LocaleSwitcher />
                </li>
                <li>
                    <CategoriesSheet />
                </li>
            </ul>
        </nav>
    );
}