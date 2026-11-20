"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "../lib/format";
import { getSellerStartingPrice, isColorInStock } from "../lib/variants";
import type { CurrencyCode, ProductColor, ProductSeller, ProductSize } from "../types";

const optionClassName =
    "outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";

function OptionGroup({ label, value, children }: { label: string; value?: string; children: ReactNode }) {
    return (
        <div role="group" aria-label={label} className="flex flex-col gap-2.5">
            <p className="text-sm font-medium">
                {label}
                {value ? <span className="ms-1.5 font-normal text-muted-foreground">{value}</span> : null}
            </p>
            {children}
        </div>
    );
}

interface SellerPickerProps {
    sellers: ProductSeller[];
    selectedId: string | undefined;
    currency: CurrencyCode;
    onSelect: (sellerId: string) => void;
}

/** Rendered only when a product has more than one seller. */
export function SellerPicker({ sellers, selectedId, currency, onSelect }: SellerPickerProps) {
    const t = useTranslations("shop.detail");

    return (
        <OptionGroup label={t("seller")}>
            <ul className="flex flex-col gap-2">
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
                                    "flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-start text-sm",
                                    isSelected ? "border-brand bg-brand/5" : "border-border/70 hover:border-brand/40",
                                )}
                            >
                <span className="flex flex-col gap-0.5">
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
        </OptionGroup>
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
        <OptionGroup label={t("color")} value={selected?.name}>
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
        </OptionGroup>
    );
}

interface SizePickerProps {
    sizes: ProductSize[];
    selectedId: string | undefined;
    onSelect: (sizeId: string) => void;
}

/** Rendered only when the selected color has sizes. */
export function SizePicker({ sizes, selectedId, onSelect }: SizePickerProps) {
    const t = useTranslations("shop.detail");
    const selected = sizes.find((size) => size.id === selectedId);

    return (
        <OptionGroup label={t("size")} value={selected?.label}>
            <ul className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                    const isSelected = size.id === selectedId;

                    return (
                        <li key={size.id}>
                            <button
                                type="button"
                                aria-pressed={isSelected}
                                disabled={size.stock <= 0}
                                onClick={() => onSelect(size.id)}
                                className={cn(
                                    optionClassName,
                                    "min-w-14 rounded-xl border px-3 py-2 text-sm font-medium disabled:line-through",
                                    isSelected ? "border-brand bg-brand/5 text-brand" : "border-border/70 hover:border-brand/40",
                                )}
                            >
                                {size.label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </OptionGroup>
    );
}