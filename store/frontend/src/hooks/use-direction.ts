import { hasLocale, useLocale } from "next-intl";
import { getDirection, routing } from "@/i18n/routing";

export function useDirection() {
    const locale = useLocale();
    return hasLocale(routing.locales, locale) ? getDirection(locale) : "ltr";
}