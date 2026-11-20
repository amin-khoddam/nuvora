"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "../lib/format";
import { getSellerStartingPrice, isColorInStock } from "../lib/variants";
import type { CurrencyCode, ProductColor, ProductSeller } from "../types";

const optionClassName =
    "outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";

interface SellerSectionProps {
    sellers: ProductSeller[];
    selectedId: string | undefined;
    currency: CurrencyCode;
    onSelect: (sellerId: string) => void;
}

/** Placed above the specifications; rendered only when a product has more than one seller. */
export function SellerSection({ sellers, selectedId, currency, onSelect }: SellerSectionProps) {
    const t = useTranslations("shop.detail");

    return (
        <section id="sellers" aria-labelledby="sellers-title">
            <h2 id="sellers-title" className="mb-4 font-display text-xl font-semibold sm:text-2xl">
                {t("sellersTitle")}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sellers.map((seller) => {
                    const isSelected = seller.id === selectedId;
                    const startingPrice = getSellerStartingPrice(seller);

                    return (
                        <li key={seller.id}>
                            <button
                                type="button"
                                aria-pressed={isSelected}
                                disabled={startingPrice === null}
                                onClick={() => onSelect(seller.id)}
                                className={cn(
                                    optionClassName,
                                    "flex h-full w-full items-center justify-between gap-3 rounded-2xl border p-4 text-start text-sm",
                                    isSelected ? "border-brand bg-brand/5" : "border-border/70 hover:border-brand/40",
                                )}
                            >
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{seller.name}</span>
                    {seller.rating !== null ? (
                        <span className="tabular-amount flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
                            {seller.rating.toFixed(1)}
                    </span>
                    ) : null}
                </span>
                                <span className="tabular-amount text-end text-xs text-muted-foreground">
                  {startingPrice === null ? (
                      t("unavailable")
                  ) : (
                      <>
                          {t("from")}{" "}
                          <span className="text-sm font-semibold text-foreground">
                        {formatPrice(startingPrice, currency)}
                      </span>
                      </>
                  )}
                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

interface ColorPickerProps {
    colors: ProductColor[];
    selectedId: string | undefined;
    onSelect: (colorId: string) => void;
}

export function ColorPicker({ colors, selectedId, onSelect }: ColorPickerProps) {
    const t = useTranslations("shop.detail");
    const selected = colors.find((color) => color.id === selectedId);

    return (
        <div role="group" aria-label={t("color")} className="flex flex-col gap-2.5">
            <p className="text-sm font-medium">
                {t("color")}
                {selected ? <span className="ms-1.5 font-normal text-muted-foreground">{selected.name}</span> : null}
            </p>
            <ul className="flex flex-wrap gap-2">
                {colors.map((color) => {
                    const isSelected = color.id === selectedId;

                    return (
                        <li key={color.id}>
                            <button
                                type="button"
                                title={color.name}
                                aria-label={color.name}
                                aria-pressed={isSelected}
                                disabled={!isColorInStock(color)}
                                onClick={() => onSelect(color.id)}
                                className={cn(
                                    optionClassName,
                                    "grid size-10 place-items-center rounded-full border-2",
                                    isSelected ? "border-brand" : "border-transparent hover:border-brand/40",
                                )}
                            >
                <span
                    className="size-7 rounded-full border border-border/70"
                    style={{ backgroundColor: color.hex }}
                />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}