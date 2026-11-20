"use client";

import {
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type FormEvent,
    type KeyboardEvent,
    type ReactNode,
} from "react";
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
import { buildSearchHref, getSuggestionHrefs } from "../lib/search-suggestions";
import { QueryError } from "./query-feedback";

const NO_ACTIVE_OPTION = -1;

const rowClassName =
    "flex items-center gap-3 rounded-xl p-2 text-sm outline-none transition-colors hover:bg-muted aria-selected:bg-muted";

const optionId = (listboxId: string, index: number) => `${listboxId}-option-${index}`;

/** Keeps the keyboard-selected option visible inside the scrollable panel. */
function scrollIntoViewIfNeeded(element: HTMLElement | null) {
    element?.scrollIntoView({ block: "nearest" });
}

interface OptionLinkProps {
    href: string;
    id: string;
    isActive: boolean;
    onNavigate: () => void;
    className?: string;
    children: ReactNode;
}

/** Focus stays in the input; the active option is announced through `aria-activedescendant`. */
function OptionLink({ href, id, isActive, onNavigate, className, children }: OptionLinkProps) {
    return (
        <Link
            ref={isActive ? scrollIntoViewIfNeeded : undefined}
            id={id}
            role="option"
            aria-selected={isActive}
            tabIndex={-1}
            href={href}
            onClick={onNavigate}
            className={cn(rowClassName, className)}
        >
            {children}
        </Link>
    );
}

interface SearchPanelProps {
    /** Trimmed search term. */
    term: string;
    query: ReturnType<typeof useSearchSuggestions>;
    activeIndex: number;
    listboxId: string;
    onNavigate: () => void;
}

function SearchPanel({ term, query, activeIndex, listboxId, onNavigate }: SearchPanelProps) {
    const t = useTranslations("shop.search");

    if (term.length < SEARCH_MIN_LENGTH) {
        return <p className="p-2 text-sm text-muted-foreground">{t("hint", { count: SEARCH_MIN_LENGTH })}</p>;
    }
    if (query.isPending) {
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
    if (query.isError) return <QueryError error={query.error} onRetry={() => void query.refetch()} />;

    const { categories, products } = query.data;
    if (categories.length === 0 && products.length === 0) {
        return <p className="p-2 text-sm text-muted-foreground">{t("noResults", { term })}</p>;
    }

    // Same order as `getSuggestionHrefs`: categories, products, "see all".
    const productsOffset = categories.length;
    const seeAllIndex = categories.length + products.length;

    return (
        <div className="flex flex-col gap-4">
            {categories.length > 0 ? (
                <div role="group" aria-labelledby={`${listboxId}-categories`}>
                    <h3 id={`${listboxId}-categories`} className="px-2 pb-1 text-xs font-semibold text-muted-foreground">
                        {t("categories")}
                    </h3>
                    {categories.map((category, index) => (
                        <OptionLink
                            key={category.id}
                            href={shopRoutes.category(category.path)}
                            id={optionId(listboxId, index)}
                            isActive={index === activeIndex}
                            onNavigate={onNavigate}
                        >
                            <LayoutGrid className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                            <span className="font-medium">{category.name}</span>
                            {category.trail.length > 0 ? (
                                <span className="truncate text-xs text-muted-foreground">{category.trail.join(" / ")}</span>
                            ) : null}
                        </OptionLink>
                    ))}
                </div>
            ) : null}

            {products.length > 0 ? (
                <div role="group" aria-labelledby={`${listboxId}-products`}>
                    <h3 id={`${listboxId}-products`} className="px-2 pb-1 text-xs font-semibold text-muted-foreground">
                        {t("products")}
                    </h3>
                    {products.map((product, index) => (
                        <OptionLink
                            key={product.id}
                            href={shopRoutes.product(product.slug)}
                            id={optionId(listboxId, productsOffset + index)}
                            isActive={productsOffset + index === activeIndex}
                            onNavigate={onNavigate}
                        >
              <span className="relative size-10 shrink-0">
                <Image src={product.image} alt="" fill sizes="40px" className="object-contain" />
              </span>
                            <span className="min-w-0 flex-1 truncate font-medium">{product.name}</span>
                            <span className="tabular-amount shrink-0 text-muted-foreground">
                {formatPrice(product.price, product.currency)}
              </span>
                        </OptionLink>
                    ))}
                </div>
            ) : null}

            <OptionLink
                href={buildSearchHref(term)}
                id={optionId(listboxId, seeAllIndex)}
                isActive={seeAllIndex === activeIndex}
                onNavigate={onNavigate}
                className="justify-center bg-muted/60 p-2.5 font-medium text-brand"
            >
                {t("seeAll", { term })}
            </OptionLink>
        </div>
    );
}

interface SearchInputProps {
    className?: string;
}

/**
 * Header search. Focusing it dims the page and opens live suggestions.
 * Keyboard: ↑/↓ move through the suggestions, Enter opens the active one (or
 * runs the full search when none is active), Escape closes.
 */
export function SearchInput({ className }: SearchInputProps) {
    const t = useTranslations("shop.search");
    const router = useRouter();
    const listboxId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const mounted = useIsMounted();
    const [term, setTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(NO_ACTIVE_OPTION);

    const trimmed = term.trim();
    const debounced = useDebouncedValue(trimmed);
    // No request while the panel is closed.
    const query = useSearchSuggestions(open ? debounced : "");
    const hrefs = query.data && trimmed.length >= SEARCH_MIN_LENGTH ? getSuggestionHrefs(query.data, trimmed) : [];
    const hasActiveOption = open && activeIndex >= 0 && activeIndex < hrefs.length;

    function close() {
        setOpen(false);
        setActiveIndex(NO_ACTIVE_OPTION);
        inputRef.current?.blur();
    }

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setTerm(event.target.value);
        setActiveIndex(NO_ACTIVE_OPTION);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const href = hasActiveOption ? hrefs[activeIndex] : trimmed ? buildSearchHref(trimmed) : undefined;
        if (!href) return;

        close();
        router.push(href);
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

        event.preventDefault();
        setOpen(true);
        if (hrefs.length === 0) return;

        const last = hrefs.length - 1;
        setActiveIndex((current) => {
            if (event.key === "ArrowDown") return current >= last ? 0 : current + 1;
            return current <= 0 ? last : current - 1;
        });
    }

    function handleWrapperKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Escape") close();
    }

    function handleBlur(event: FocusEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpen(false);
            setActiveIndex(NO_ACTIVE_OPTION);
        }
    }

    return (
        <>
            <div role="search" className={cn("relative", className)} onKeyDown={handleWrapperKeyDown} onBlur={handleBlur}>
                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="search"
                        name="q"
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={open ? listboxId : undefined}
                        aria-activedescendant={hasActiveOption ? optionId(listboxId, activeIndex) : undefined}
                        aria-autocomplete="list"
                        aria-label={t("label")}
                        autoComplete="off"
                        placeholder={t("placeholder")}
                        value={term}
                        onChange={handleChange}
                        onFocus={() => setOpen(true)}
                        onKeyDown={handleInputKeyDown}
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
                        id={listboxId}
                        role="listbox"
                        aria-label={t("label")}
                        // Keeps focus in the input while the panel is clicked, so a blur never unmounts a link mid-click.
                        onMouseDown={(event) => event.preventDefault()}
                        className="absolute end-0 top-full z-50 mt-3 max-h-[70dvh] w-[min(32rem,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-[var(--elevation-elevated)] lg:start-0 lg:end-auto lg:w-[28rem]"
                    >
                        <SearchPanel
                            term={trimmed}
                            query={query}
                            activeIndex={activeIndex}
                            listboxId={listboxId}
                            onNavigate={close}
                        />
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