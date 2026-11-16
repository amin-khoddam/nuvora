"use client";

import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { shopRoutes } from "@/config/shop";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";

export function CategoriesMenu() {
    const t = useTranslations("shop");
    const { data: categories, isPending, isError } = useCategories();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                    {t("nav.categories")}
                    <ChevronDown aria-hidden />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                {isPending ? (
                    <DropdownMenuLabel>{t("states.loading")}</DropdownMenuLabel>
                ) : isError ? (
                    <DropdownMenuLabel>{t("states.errors.generic")}</DropdownMenuLabel>
                ) : categories.length === 0 ? (
                    <DropdownMenuLabel>{t("states.empty")}</DropdownMenuLabel>
                ) : (
                    categories.map((category) => (
                        <DropdownMenuItem key={category.id} asChild>
                            <Link href={shopRoutes.category(category.slug)}>{category.name}</Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}