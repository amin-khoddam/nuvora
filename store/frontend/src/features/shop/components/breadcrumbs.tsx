"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export interface BreadcrumbItem {
    label: string;
    /** Navigates with a link. */
    href?: string;
    /** In-place navigation (used inside the category menu). */
    onSelect?: () => void;
}

const crumbClassName =
    "rounded-md outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring";

/** The last item is always the current page and is never interactive. */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    const t = useTranslations("shop.detail");

    return (
        <nav aria-label={t("breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    let content;

                    if (isLast) {
                        content = (
                            <span aria-current="page" className="font-medium text-foreground">
                {item.label}
              </span>
                        );
                    } else if (item.href) {
                        content = (
                            <Link href={item.href} className={crumbClassName}>
                                {item.label}
                            </Link>
                        );
                    } else if (item.onSelect) {
                        content = (
                            <button type="button" onClick={item.onSelect} className={crumbClassName}>
                                {item.label}
                            </button>
                        );
                    } else {
                        content = <span>{item.label}</span>;
                    }

                    return (
                        <li key={`${index}-${item.label}`} className="flex items-center gap-1.5">
                            {content}
                            {isLast ? null : <ChevronRight className="size-4 rtl:-scale-x-100" aria-hidden />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}