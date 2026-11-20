import { DEFAULT_CURRENCY, type CurrencyCode } from "../types";

/** Latin digits in every locale, as the design requires. */
const NUMBER_LOCALE = "en-US";

const compactFormatter = new Intl.NumberFormat(NUMBER_LOCALE, { notation: "compact" });

export function formatPrice(amount: number, currency: CurrencyCode = DEFAULT_CURRENCY): string {
    return new Intl.NumberFormat(NUMBER_LOCALE, {
        style: "currency",
        currency,
        maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
}

export function formatCompactNumber(value: number): string {
    return compactFormatter.format(value);
}