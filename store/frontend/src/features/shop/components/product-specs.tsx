import { useTranslations } from "next-intl";
import { Surface } from "@/components/ui/surface";
import type { ProductSpec } from "../types";

export function ProductSpecs({ specs }: { specs: ProductSpec[] }) {
    const t = useTranslations("shop.detail");

    if (specs.length === 0) return null;

    return (
        <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="mb-4 font-display text-xl font-semibold sm:text-2xl">
                {t("specs")}
            </h2>
            <Surface padding="none">
                <dl className="divide-y divide-border/70">
                    {specs.map((spec) => (
                        <div key={spec.label} className="grid grid-cols-2 gap-4 px-5 py-3.5 text-sm sm:grid-cols-[14rem_1fr]">
                            <dt className="text-muted-foreground">{spec.label}</dt>
                            <dd className="font-medium">{spec.value}</dd>
                        </div>
                    ))}
                </dl>
            </Surface>
        </section>
    );
}