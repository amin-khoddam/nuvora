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
import { useChangeCurrency } from "../hooks/use-change-currency";
import { useShopStore } from "../store/shop-store";
import { CURRENCIES, isCurrencyCode } from "../types";

interface CurrencyMenuProps {
    /** Round icon-sized trigger showing only the code; used in the bottom bar. */
    compact?: boolean;
}

export function CurrencyMenu({ compact = false }: CurrencyMenuProps) {
    const t = useTranslations("shop");
    const currency = useShopStore((state) => state.currency);
    const changeCurrency = useChangeCurrency();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {compact ? (
                    <Button
                        variant="ghost"
                        size="icon-lg"
                        className="size-10 rounded-full text-xs font-semibold"
                        aria-label={`${t("toolbar.currency")}: ${currency}`}
                    >
                        <span className="tabular-amount">{currency}</span>
                    </Button>
                ) : (
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
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align={compact ? "center" : "end"}>
                <DropdownMenuLabel>{t("toolbar.currency")}</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={currency}
                    onValueChange={(value) => isCurrencyCode(value) && changeCurrency(value)}
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