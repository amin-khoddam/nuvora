import { usePathname, useRouter } from "@/i18n/navigation";
import { collectCurrencyFilterKeys } from "../lib/category-tree";
import { useShopStore } from "../store/shop-store";
import type { CurrencyCode } from "../types";
import { useCategories } from "./use-shop-queries";

/**
 * Switches the currency and drops money-based filters (e.g. `price=100-500`)
 * from the URL. Their numbers belong to the old currency; keeping them would
 * silently reinterpret "500 USD" as "500 EUR". Runs in the event handler, so
 * no effect is needed and the URL is read only at click time.
 */
export function useChangeCurrency() {
    const setCurrency = useShopStore((state) => state.setCurrency);
    const { data: categories } = useCategories();
    const pathname = usePathname();
    const router = useRouter();

    return (currency: CurrencyCode) => {
        const params = new URLSearchParams(window.location.search);
        const staleKeys = collectCurrencyFilterKeys(categories ?? []).filter((key) => params.has(key));

        if (staleKeys.length > 0) {
            for (const key of staleKeys) params.delete(key);
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }

        setCurrency(currency);
    };
}