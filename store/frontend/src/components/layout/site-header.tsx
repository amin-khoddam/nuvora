"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopNavItems } from "@/config/shop";
import { CategoriesMenu } from "@/features/shop/components/categories-menu";
import { CurrencyMenu } from "@/features/shop/components/currency-menu";
import { SearchInput } from "@/features/shop/components/search-input";
import { selectCartCount, useShopStore } from "@/features/shop/store/shop-store";
import { useScrolled } from "@/hooks/use-scrolled";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const t = useTranslations("shop.nav");
  const pathname = usePathname();
  const scrolled = useScrolled();
  const cartCount = useShopStore(selectCartCount);

  return (
      <header className="sticky top-0 z-50 pt-3 sm:pt-4">
        <div className="container-page">
          <div
              className={cn(
                  "flex items-center gap-2 rounded-2xl px-2 py-2 transition-[background-color,box-shadow] duration-300 sm:rounded-full sm:px-3 lg:gap-3",
                  scrolled ? "glass-panel-strong" : "glass-panel",
              )}
          >
            <Brand className="ps-1" />

            <nav aria-label={t("mainNavigation")} className="mx-auto hidden items-center gap-1 lg:flex">
              {shopNavItems.map((item) => {
                if (item.id === "categories") return <CategoriesMenu key={item.id} />;

                const isActive = isActivePath(pathname, item.href);
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                            "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring",
                            isActive
                                ? "text-brand after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-brand"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                      {t(item.id)}
                    </Link>
                );
              })}
            </nav>

            <div className="ms-auto flex items-center gap-1.5 lg:ms-0">
              <SearchInput className="hidden w-52 md:block lg:w-64" />

              <div className="flex items-center gap-0.5 rounded-full border border-border/70 p-0.5">
                <Button asChild variant="ghost" size="icon-lg" className="size-10 rounded-full">
                  <Link href="/account" aria-label={t("account")}>
                    <User />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon-lg" className="relative size-10 rounded-full">
                  <Link href="/cart" aria-label={t("cart")}>
                    <ShoppingCart />
                    {cartCount > 0 ? (
                        <span className="tabular-amount absolute end-0 top-0 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[0.65rem] leading-4 font-semibold text-primary-foreground">
                      {cartCount}
                    </span>
                    ) : null}
                  </Link>
                </Button>
              </div>

              <div className="hidden items-center gap-0.5 md:flex">
                <CurrencyMenu />
                <ThemeToggle />
                <LocaleSwitcher />
              </div>

              <MobileNav />
            </div>
          </div>
        </div>
      </header>
  );
}