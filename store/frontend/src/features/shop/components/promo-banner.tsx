import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { promoBanner } from "@/config/shop";
import { Link } from "@/i18n/navigation";

export function PromoBanner() {
    const t = useTranslations("shop.promo");

    return (
        <section
            aria-labelledby="promo-title"
            className="relative isolate overflow-hidden rounded-3xl bg-[oklch(0.16_0.02_272)] text-white"
        >
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-linear-to-l from-brand/50 via-brand/10 to-transparent rtl:bg-linear-to-r"
            />
            <div aria-hidden className="absolute inset-y-0 end-0 -z-10 hidden w-1/2 sm:block">
                <Image src={promoBanner.image} alt="" fill sizes="50vw" className="object-contain p-4" />
            </div>

            <div className="flex flex-col items-start gap-3 px-6 py-10 sm:px-12 sm:py-12">
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
          {t("badge")}
        </span>
                <h2 id="promo-title" className="font-display text-3xl font-bold sm:text-4xl">
                    {t("title")}
                </h2>
                <p className="text-white/70">{t("subtitle")}</p>
                <Button asChild size="lg" className="mt-2 rounded-full bg-white text-zinc-950 hover:bg-white/90">
                    <Link href={promoBanner.href}>
                        {t("cta")}
                        <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" aria-hidden />
                    </Link>
                </Button>
            </div>
        </section>
    );
}