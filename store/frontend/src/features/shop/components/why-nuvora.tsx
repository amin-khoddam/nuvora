import { useTranslations } from "next-intl";
import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const items = [
    { id: "authentic", Icon: ShieldCheck },
    { id: "shipping", Icon: Truck },
    { id: "support", Icon: Headphones },
    { id: "returns", Icon: RotateCcw },
] as const;

export function WhyNuvora() {
    const t = useTranslations("shop");

    return (
        <section aria-labelledby="why-title">
            <h2 id="why-title" className="font-display text-xl font-semibold sm:text-2xl">
                {t("sections.why")}
            </h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map(({ id, Icon }) => (
                    <li
                        key={id}
                        className="flex items-center gap-4 lg:border-s lg:border-border/70 lg:ps-6 lg:first:border-s-0 lg:first:ps-0"
                    >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
              <Icon className="size-6" aria-hidden />
            </span>
                        <span className="text-sm font-medium">{t(`why.${id}`)}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}