"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";
import { getCategoryHref, getEffectiveFilters, resolvePathBySlugs } from "../lib/category-tree";
import { parseActiveFilters, type SearchParamsRecord } from "../lib/filter-query";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { CategoryFilterSections, ChipLink } from "./category-filters";
import { EmptyState, QueryError } from "./query-feedback";

interface CategoryPageProps {
    slugs: string[];
    searchParams: SearchParamsRecord;
}

/**
 * Placeholder for `/shop/...`: resolves the slug chain against the category
 * tree and shows breadcrumb, sub-categories and the filters in the URL. The
 * product listing itself is out of scope.
 */
export function CategoryPage({ slugs, searchParams }: CategoryPageProps) {
    const t = useTranslations("shop");
    const { data: roots, isPending, isError, error, refetch } = useCategories();

    if (isPending) {
        return (
            <div aria-hidden className="flex flex-col gap-4">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-24" />
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
    const children = current ? current.children : roots;
    const basePath = getCategoryHref(path);
    const filters = getEffectiveFilters(path);
    const activeFilters = parseActiveFilters(filters, searchParams);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: siteConfig.name, href: shopRoutes.home },
        ...(current
            ? path.map((category, index) => ({
                label: category.name,
                href: getCategoryHref(path.slice(0, index + 1)),
            }))
            : [{ label: t("nav.shop") }]),
    ];

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="font-display text-3xl font-bold">{current?.name ?? t("nav.shop")}</h1>

            {activeFilters.length > 0 ? (
                <section aria-label={t("categoryPage.activeFilters")} className="flex flex-wrap items-center gap-2">
                    {activeFilters.map((filter) => (
                        <span
                            key={filter.key}
                            className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand"
                        >
              {filter.filterLabel}: {filter.valueLabel}
            </span>
                    ))}
                    <Link href={basePath} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                        {t("categoryPage.clearFilters")}
                    </Link>
                </section>
            ) : null}

            {children.length > 0 ? (
                <section aria-label={t("categoryPage.subcategories")}>
                    <h2 className="mb-2 text-xs font-semibold text-muted-foreground">{t("categoryPage.subcategories")}</h2>
                    <ul className="flex flex-wrap gap-2">
                        {children.map((child) => (
                            <li key={child.id}>
                                <ChipLink href={getCategoryHref([...path, child])}>{child.name}</ChipLink>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <CategoryFilterSections filters={filters} basePath={basePath} />

            <EmptyState message={t("categoryPage.placeholder")} />
        </div>
    );
}