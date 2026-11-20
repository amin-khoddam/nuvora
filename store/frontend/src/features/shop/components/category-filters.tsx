"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { getFilterLinks } from "../lib/filter-query";
import { useShopStore } from "../store/shop-store";
import type { CategoryFilter } from "../types";

interface ChipLinkProps {
    href: string;
    onNavigate?: () => void;
    children: ReactNode;
}

export function ChipLink({ href, onNavigate, children }: ChipLinkProps) {
    return (
        <Link
            href={href}
            onClick={onNavigate}
            className="tabular-amount inline-flex rounded-full border border-border/70 px-3 py-1 text-sm text-muted-foreground transition-colors outline-none hover:border-brand/40 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
        >
            {children}
        </Link>
    );
}

interface CategoryFilterSectionsProps {
    filters: CategoryFilter[];
    /** Category URL the filter query is appended to. */
    basePath: string;
    onNavigate?: () => void;
}

/** Quick filter links inside the category menu; range presets are formatted in the selected currency. */
export function CategoryFilterSections({ filters, basePath, onNavigate }: CategoryFilterSectionsProps) {
    const currency = useShopStore((state) => state.currency);

    if (filters.length === 0) return null;

    return (
        <div className="flex flex-col gap-4">
            {filters.map((filter) => (
                <section key={filter.key} aria-label={filter.label}>
                    <h3 className="mb-2 text-xs font-semibold text-muted-foreground">{filter.label}</h3>
                    <ul className="flex flex-wrap gap-2">
                        {getFilterLinks(filter, basePath, currency).map((link) => (
                            <li key={link.value}>
                                <ChipLink href={link.href} onNavigate={onNavigate}>
                                    {link.label}
                                </ChipLink>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}