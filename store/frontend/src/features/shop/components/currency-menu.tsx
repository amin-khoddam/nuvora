"use client";

import { useTranslations } from "next-intl";
import { ChevronDown, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShopStore } from "../store/shop-store";
import { CURRENCIES, isCurrencyCode } from "../types";

export function CurrencyMenu() {
    const t = useTranslations("shop");
    const currency = useShopStore((state) => state.currency);
    const setCurrency = useShopStore((state) => state.setCurrency);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-foreground"
                    aria-label={`${t("toolbar.currency")}: ${currency}`}
                >
                    <Coins aria-hidden />
                    <span className="tabular-amount">{currency}</span>
                    <ChevronDown aria-hidden />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("toolbar.currency")}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={currency}
                    onValueChange={(value) => isCurrencyCode(value) && setCurrency(value)}
                >
                    {CURRENCIES.map((code) => (
                        <DropdownMenuRadioItem key={code} value={code}>
                            {t(`currency.${code}`)}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}