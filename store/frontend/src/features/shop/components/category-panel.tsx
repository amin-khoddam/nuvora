"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getCategoryHref, getEffectiveFilters } from "../lib/category-tree";
import type { Category } from "../types";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";
import { CategoryFilterSections } from "./category-filters";

const rowClassName =
    "flex w-full items-center gap-3 rounded-xl p-3 text-start text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring";

interface CategoryPanelProps {
    /** Categories from the root to the node being shown; empty on the mobile root list. */
    path: readonly Category[];
    /** What to list: the current node's children, or the roots. */
    items: readonly Category[];
    layout: "grid" | "list";
    /** Adds a first breadcrumb that goes back to the root list (mobile). */
    rootLabel?: string;
    onCrumbSelect: (depth: number) => void;
    onDrill: (category: Category) => void;
    /** Called when a link is followed, so the container can close. */
    onNavigate: () => void;
}

export function CategoryPanel({
                                  path,
                                  items,
                                  layout,
                                  rootLabel,
                                  onCrumbSelect,
                                  onDrill,
                                  onNavigate,
                              }: CategoryPanelProps) {
    const t = useTranslations("shop.categoryMenu");
    const current = path.at(-1);
    const currentHref = getCategoryHref(path);

    const crumbs: BreadcrumbItem[] = [
        ...(rootLabel ? [{ label: rootLabel, onSelect: () => onCrumbSelect(0) }] : []),
        ...path.map((category, index) => ({ label: category.name, onSelect: () => onCrumbSelect(index + 1) })),
    ];

    return (
        <div className="flex flex-col gap-5">
            {path.length > 0 ? <Breadcrumbs items={crumbs} /> : null}

            {current ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold">{current.name}</h2>
                    <Link
                        href={currentHref}
                        onClick={onNavigate}
                        className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
                    >
                        {t("viewAll", { name: current.name })}
                        <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                    </Link>
                </div>
            ) : null}

            {items.length > 0 ? (
                <ul className={cn(layout === "grid" ? "grid grid-cols-2 gap-1 xl:grid-cols-3" : "flex flex-col gap-1")}>
                    {items.map((category) => {
                        const content = (
                            <>
                                {layout === "list" && category.image ? (
                                    <span className="relative size-10 shrink-0">
                    <Image src={category.image} alt="" fill sizes="40px" className="object-contain" />
                  </span>
                                ) : null}
                                <span className="flex-1">{category.name}</span>
                            </>
                        );

                        return (
                            <li key={category.id}>
                                {category.children.length > 0 ? (
                                    <button type="button" className={rowClassName} onClick={() => onDrill(category)}>
                                        {content}
                                        <ChevronRight className="size-4 text-muted-foreground rtl:-scale-x-100" aria-hidden />
                                    </button>
                                ) : (
                                    <Link href={getCategoryHref([...path, category])} className={rowClassName} onClick={onNavigate}>
                                        {content}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : null}

            {current ? (
                <CategoryFilterSections
                    filters={getEffectiveFilters(path)}
                    basePath={currentHref}
                    onNavigate={onNavigate}
                />
            ) : null}
        </div>
    );
}