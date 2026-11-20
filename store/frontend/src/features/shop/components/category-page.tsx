"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";
import { useListingNavigation } from "../hooks/use-listing-navigation";
import { getCategoryHref, getEffectiveFilters, resolvePathBySlugs } from "../lib/category-tree";
import { parseActiveFilters, readParam, type SearchParamsRecord } from "../lib/filter-query";
import { useShopStore } from "../store/shop-store";
import { CATALOG_PAGE_SIZE, DEFAULT_SORT, isProductSort, type CatalogQuery, type ProductSort } from "../types";
import { ActiveFilterChips } from "./active-filter-chips";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { CatalogCount, CatalogList } from "./catalog-results";
import { CategorySlider } from "./category-slider";
import { FiltersSheet } from "./filters-sheet";
import { QueryError } from "./query-feedback";
import { SectionHeader } from "./section-header";
import { ShopFilters } from "./shop-filters";
import { SortMenu } from "./sort-menu";

interface CategoryPageProps {
    slugs: string[];
    searchParams: SearchParamsRecord;
}

function readSort(searchParams: SearchParamsRecord): ProductSort {
    const value = readParam(searchParams, "sort");
    return value !== null && isProductSort(value) ? value : DEFAULT_SORT;
}

/**
 * `/shop/...`: sub-categories, a sticky filter sidebar (a full-screen sheet
 * below `lg`), sort, and an infinitely scrolling product list. Category,
 * `q`, `sort` and filters all live in the URL.
 */
export function CategoryPage({ slugs, searchParams }: CategoryPageProps) {
    const t = useTranslations("shop");
    const currency = useShopStore((state) => state.currency);
    const { data: roots, isPending, isError, error, refetch } = useCategories();
    const { setFilter, clearFilters, setSort } = useListingNavigation(searchParams);

    if (isPending) {
        return (
            <div aria-hidden className="flex flex-col gap-4">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-28" />
            </div>
        );
    }
    if (isError) return <QueryError error={error} onRetry={() => void refetch()} />;

    const path = resolvePathBySlugs(roots, slugs);
    if (!path) {
        return (
            <Surface role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
                <h1 className="font-display text-2xl font-semibold">{t("categoryPage.notFoundTitle")}</h1>
                <p className="text-sm text-muted-foreground">{t("categoryPage.notFound")}</p>
                <Button asChild variant="outline" className="mt-2 rounded-full">
                    <Link href={shopRoutes.shop}>{t("detail.backToShop")}</Link>
                </Button>
            </Surface>
        );
    }

    const current = path.at(-1);
    const subcategories = current ? current.children : roots;
    const filters = getEffectiveFilters(path);
    const activeFilters = parseActiveFilters(filters, searchParams, currency);
    const activeValues = Object.fromEntries(activeFilters.map((filter) => [filter.key, filter.values]));
    const activeKeys = activeFilters.map((filter) => filter.key);
    const q = readParam(searchParams, "q")?.trim() || null;
    const sort = readSort(searchParams);

    const query: CatalogQuery = {
        category: slugs.length > 0 ? slugs.join("/") : null,
        q,
        sort,
        currency,
        filters: activeValues,
        pageSize: CATALOG_PAGE_SIZE,
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: siteConfig.name, href: shopRoutes.home },
        ...(current
            ? path.map((category, index) => ({
                label: category.name,
                href: getCategoryHref(path.slice(0, index + 1)),
            }))
            : [{ label: t("nav.shop") }]),
    ];

    const hasFilters = filters.length > 0;

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl font-bold text-balance">
                {q ? t("listing.searchTitle", { query: q }) : (current?.name ?? t("nav.shop"))}
            </h1>

            {subcategories.length > 0 ? (
                <section aria-label={current ? t("categoryPage.subcategories") : t("sections.categories")}>
                    <SectionHeader title={current ? t("categoryPage.subcategories") : t("sections.categories")} />
                    <CategorySlider
                        categories={subcategories}
                        getHref={(category) => getCategoryHref([...path, category])}
                    />
                </section>
            ) : null}

            <div className={hasFilters ? "grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]" : undefined}>
                {hasFilters ? (
                    <aside aria-label={t("listing.filters")} className="sticky top-24 hidden lg:block">
                        <Surface className="max-h-[calc(100dvh-7.5rem)] overflow-y-auto">
                            <ShopFilters filters={filters} values={activeValues} onChange={setFilter} />
                        </Surface>
                    </aside>
                ) : null}

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <CatalogCount query={query} />
                        <div className="flex items-center gap-2">
                            {hasFilters ? (
                                <FiltersSheet
                                    filters={filters}
                                    values={activeValues}
                                    activeCount={activeFilters.length}
                                    onChange={setFilter}
                                    onClear={() => clearFilters(activeKeys)}
                                />
                            ) : null}
                            <SortMenu value={sort} onChange={setSort} />
                        </div>
                    </div>

                    <ActiveFilterChips
                        filters={activeFilters}
                        onRemove={(key) => setFilter(key, [])}
                        onClear={() => clearFilters(activeKeys)}
                    />

                    <CatalogList query={query} />
                </div>
            </div>
        </div>
    );
}