"use client";

import { useId, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LayoutGrid, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { shopRoutes } from "@/config/shop";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "../hooks/use-debounced-value";
import { SEARCH_MIN_LENGTH, useSearchSuggestions } from "../hooks/use-shop-queries";
import { formatPrice } from "../lib/format";
import { QueryError } from "./query-feedback";

const rowClassName =
    "flex items-center gap-3 rounded-xl p-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring";

function SuggestionHeading({ children }: { children: string }) {
    return <h3 className="px-2 pb-1 text-xs font-semibold text-muted-foreground">{children}</h3>;
}

function SearchPanel({ term, onNavigate }: { term: string; onNavigate: () => void }) {
    const t = useTranslations("shop.search");
    const trimmed = term.trim();
    const debounced = useDebouncedValue(trimmed);
    const { data, isPending, isError, error, refetch } = useSearchSuggestions(debounced);

    if (trimmed.length < SEARCH_MIN_LENGTH) {
        return <p className="p-2 text-sm text-muted-foreground">{t("hint", { count: SEARCH_MIN_LENGTH })}</p>;
    }
    if (isPending) {
        return (
            <ul aria-hidden className="flex flex-col gap-2">
                {Array.from({ length: 3 }, (_, index) => (
                    <li key={index}>
                        <Skeleton className="h-12 rounded-xl" />
                    </li>
                ))}
            </ul>
        );
    }
    if (isError) return <QueryError error={error} onRetry={() => void refetch()} />;
    if (data.categories.length === 0 && data.products.length === 0) {
        return <p className="p-2 text-sm text-muted-foreground">{t("noResults", { term: trimmed })}</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            {data.categories.length > 0 ? (
                <section>
                    <SuggestionHeading>{t("categories")}</SuggestionHeading>
                    <ul>
                        {data.categories.map((category) => (
                            <li key={category.id}>
                                <Link href={shopRoutes.category(category.path)} onClick={onNavigate} className={rowClassName}>
                                    <LayoutGrid className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                                    <span className="font-medium">{category.name}</span>
                                    {category.trail.length > 0 ? (
                                        <span className="truncate text-xs text-muted-foreground">{category.trail.join(" / ")}</span>
                                    ) : null}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            {data.products.length > 0 ? (
                <section>
                    <SuggestionHeading>{t("products")}</SuggestionHeading>
                    <ul>
                        {data.products.map((product) => (
                            <li key={product.id}>
                                <Link href={shopRoutes.product(product.slug)} onClick={onNavigate} className={rowClassName}>
                  <span className="relative size-10 shrink-0">
                    <Image src={product.image} alt="" fill sizes="40px" className="object-contain" />
                  </span>
                                    <span className="min-w-0 flex-1 truncate font-medium">{product.name}</span>
                                    <span className="tabular-amount shrink-0 text-muted-foreground">
                    {formatPrice(product.price, product.currency)}
                  </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            <Link
                href={`${shopRoutes.shop}?${new URLSearchParams({ q: trimmed }).toString()}`}
                onClick={onNavigate}
                className="rounded-xl bg-muted/60 p-2.5 text-center text-sm font-medium text-brand outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring"
            >
                {t("seeAll", { term: trimmed })}
            </Link>
        </div>
    );
}

interface SearchInputProps {
    className?: string;
}

/**
 * Header search. Focusing it dims the page and opens live suggestions;
 * submitting goes to `/shop?q=...`.
 */
export function SearchInput({ className }: SearchInputProps) {
    const t = useTranslations("shop.search");
    const router = useRouter();
    const panelId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const mounted = useIsMounted();
    const [term, setTerm] = useState("");
    const [open, setOpen] = useState(false);

    function close() {
        setOpen(false);
        inputRef.current?.blur();
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const query = term.trim();
        if (!query) return;

        close();
        router.push(`${shopRoutes.shop}?${new URLSearchParams({ q: query }).toString()}`);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Escape") close();
    }

    function handleBlur(event: FocusEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }

    return (
        <>
            <div role="search" className={cn("relative", className)} onKeyDown={handleKeyDown} onBlur={handleBlur}>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-autocomplete="list"
                        aria-label={t("label")}
                        autoComplete="off"
                        placeholder={t("placeholder")}
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        onFocus={() => setOpen(true)}
                        className="h-10 w-full rounded-xl border border-border/70 bg-muted/40 ps-4 pe-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
                    />
                    <button
                        type="submit"
                        aria-label={t("submit")}
                        className="absolute end-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
                    >
                        <Search className="size-4" aria-hidden />
                    </button>
                </form>

                {open ? (
                    <div
                        id={panelId}
                        // Keeps focus in the input while the panel is clicked, so a blur never unmounts a link mid-click.
                        onMouseDown={(event) => event.preventDefault()}
                        className="absolute end-0 top-full z-50 mt-3 max-h-[70dvh] w-[min(32rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-[var(--elevation-elevated)] lg:start-0 lg:end-auto lg:w-[28rem]"
                    >
                        <SearchPanel term={term} onNavigate={close} />
                    </div>
                ) : null}
            </div>

            {/* Portal: the header's backdrop-filter would otherwise make `fixed` relative to the header. */}
            {mounted && open
                ? createPortal(
                    <div
                        aria-hidden
                        onPointerDown={close}
                        className="fixed inset-0 z-40 bg-black/40 animate-in fade-in-0"
                    />,
                    document.body,
                )
                : null}
        </>
    );
}