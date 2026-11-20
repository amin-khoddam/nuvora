import { useTranslations } from "next-intl";
import { Brand } from "@/components/layout/brand";
import { socialIcons } from "@/components/shared/social-icons";
import { socials } from "@/config/socials";
import { footerColumns, legalLinks } from "@/config/shop";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

const footerLinkClassName = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function SiteFooter() {
    const t = useTranslations("shop.footer");
    const year = new Date().getFullYear();

    return (
        <footer className="mt-16 border-t border-border/70 bg-muted/50 text-foreground sm:mt-24">
            <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <Brand />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>

                    <div className="mt-5 flex items-center gap-2">
                        {socials.map(({ id, url }) => {
                            const Icon = socialIcons[id];
                            if (!Icon) return null;

                            return (
                                <a
                                    key={id}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={id}
                                    className="grid size-10 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
                                >
                                    <Icon className="size-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {footerColumns.map((column) => (
                    <nav key={column.id} aria-label={t(`columns.${column.id}`)}>
                        <h2 className="mb-3 text-sm font-semibold">{t(`columns.${column.id}`)}</h2>
                        <ul className="space-y-2.5">
                            {column.links.map((link) => (
                                <li key={link.id}>
                                    <Link href={link.href} className={footerLinkClassName}>
                                        {t(`links.${link.id}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="border-t border-border/70">
                <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <span>{t("copyright", { year, name: siteConfig.name })}</span>
                    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        {legalLinks.map((link) => (
                            <li key={link.id}>
                                <Link href={link.href} className="transition-colors hover:text-foreground">
                                    {t(`legal.${link.id}`)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    );
}