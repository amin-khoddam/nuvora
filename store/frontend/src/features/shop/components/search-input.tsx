import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
    const t = useTranslations("shop.search");

    return (
        <div role="search" className={cn("relative", className)}>
            <input
                type="search"
                name="q"
                aria-label={t("label")}
                placeholder={t("placeholder")}
                className="h-10 w-full rounded-full border border-border/70 bg-muted/40 ps-4 pe-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-search-cancel-button]:hidden"
            />
            <Search
                aria-hidden
                className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
        </div>
    );
}