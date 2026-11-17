"use client";

import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import { shopNavItems, shopRoutes } from "@/config/shop";
import { CurrencyMenu } from "@/features/shop/components/currency-menu";
import { SearchInput } from "@/features/shop/components/search-input";
import { useCategories } from "@/features/shop/hooks/use-shop-queries";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

const linkClassName = "block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-muted";

export function MobileNav() {
  const t = useTranslations("shop.nav");
  const { data: categories = [] } = useCategories();

  return (
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button
              variant="ghost"
              size="icon-lg"
              className="size-10 rounded-full lg:hidden"
              aria-label={t("openMenu")}
          >
            <Menu />
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-x-3 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col gap-4 overflow-y-auto rounded-3xl bg-popover p-5 text-popover-foreground shadow-[var(--elevation-elevated)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="font-display text-lg font-semibold">{t("menuTitle")}</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon-lg" aria-label={t("closeMenu")}>
                  <X />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">{t("menuDescription")}</Dialog.Description>

            <SearchInput className="md:hidden" />

            <nav aria-label={t("mainNavigation")}>
              <ul>
                {shopNavItems.map((item) =>
                    item.id === "categories" ? null : (
                        <li key={item.id}>
                          <Dialog.Close asChild>
                            <Link href={item.href} className={linkClassName}>
                              {t(item.id)}
                            </Link>
                          </Dialog.Close>
                        </li>
                    ),
                )}
              </ul>

              {categories.length > 0 ? (
                  <>
                    <h3 className="mt-3 px-3 text-xs font-medium text-muted-foreground">{t("categories")}</h3>
                    <ul className="mt-1">
                      {categories.map((category) => (
                          <li key={category.id}>
                            <Dialog.Close asChild>
                              <Link href={shopRoutes.category(category.slug)} className={linkClassName}>
                                {category.name}
                              </Link>
                            </Dialog.Close>
                          </li>
                      ))}
                    </ul>
                  </>
              ) : null}
            </nav>

            <div className="flex items-center gap-1 border-t border-border/70 pt-3 md:hidden">
              <CurrencyMenu />
              <ThemeToggle />
              <LocaleSwitcher />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
  );
}