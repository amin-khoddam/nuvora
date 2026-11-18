"use client";

import { CategoriesMenu } from "@/features/shop/components/categories-menu";
import { CurrencyMenu } from "@/features/shop/components/currency-menu";
import { SearchInput } from "@/features/shop/components/search-input";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { AccountLink, CartLink } from "./user-actions";

/**
 * Below `lg` the header is only the brand and the search field; everything
 * else lives in `BottomNav`. From `lg` up all actions sit in the header.
 */
export function SiteHeader() {
  const scrolled = useScrolled();

  return (
      <header className="sticky top-0 z-50 pt-3 sm:pt-4">
        <div className="container-page">
          <div
              className={cn(
                  "flex items-center gap-2 rounded-full px-2 py-2 transition-[background-color,box-shadow] duration-300 sm:px-3 lg:gap-3",
                  scrolled ? "glass-panel-strong" : "glass-panel",
              )}
          >
            <Brand className="shrink-0 ps-1" />

            <SearchInput className="min-w-0 flex-1 lg:max-w-sm" />

            <div className="ms-auto hidden items-center gap-1.5 lg:flex">
              <div className="flex items-center gap-0.5 rounded-full border border-border/70 p-0.5">
                <AccountLink />
                <CartLink />
              </div>

              <CurrencyMenu />

              <div className="flex items-center">
                <ThemeToggle />
                <LocaleSwitcher />
              </div>

              <CategoriesMenu />
            </div>
          </div>
        </div>
      </header>
  );
}