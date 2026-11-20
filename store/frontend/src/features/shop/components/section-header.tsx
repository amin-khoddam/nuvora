import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SectionHeaderProps {
    title: string;
    /** Omit to hide the "View all" link. */
    href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
    const t = useTranslations("shop");

    return (
        <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold sm:text-2xl">{title}</h2>
            {href ? (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring"
                >
                    {t("viewAll")}
                    <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </Link>
            ) : null}
        </div>
    );
}