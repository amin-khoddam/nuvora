import { usePathname, useRouter } from "@/i18n/navigation";
import { toURLSearchParams, type SearchParamsRecord } from "../lib/filter-query";
import { DEFAULT_SORT, type ProductSort } from "../types";

/** Writes filters and sort into the URL, keeping every other parameter (e.g. `q`). */
export function useListingNavigation(searchParams: SearchParamsRecord) {
    const router = useRouter();
    const pathname = usePathname();

    function navigate(mutate: (params: URLSearchParams) => void) {
        const params = toURLSearchParams(searchParams);
        mutate(params);
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }

    return {
        setFilter: (key: string, values: string[]) =>
            navigate((params) => {
                params.delete(key);
                for (const value of values) params.append(key, value);
            }),
        clearFilters: (keys: string[]) =>
            navigate((params) => {
                for (const key of keys) params.delete(key);
            }),
        setSort: (sort: ProductSort) =>
            navigate((params) => {
                if (sort === DEFAULT_SORT) params.delete("sort");
                else params.set("sort", sort);
            }),
    };
}