import { useTranslations } from "next-intl";
import { MotionPreferences } from "@/components/shared/motion-preferences";
import { Reveal } from "@/components/shared/reveal";
import { CategoryGrid } from "@/features/shop/components/category-grid";
import { HeroSlider } from "@/features/shop/components/hero-slider";
import { ProductSection } from "@/features/shop/components/product-section";
import { PromoBanner } from "@/features/shop/components/promo-banner";
import { WhyNuvora } from "@/features/shop/components/why-nuvora";

export default function HomePage() {
    const t = useTranslations("shop");

    return (
        <MotionPreferences>
            <h1 className="sr-only">{t("pageTitle")}</h1>
            <div className="container-page flex flex-col gap-10 pt-4 sm:gap-12">
                <HeroSlider />
                <Reveal>
                    <CategoryGrid title={t("sections.categories")} />
                </Reveal>
                <Reveal>
                    <ProductSection title={t("sections.featured")} collection="featured" showDiscountBadge />
                </Reveal>
                <Reveal>
                    <ProductSection title={t("sections.newArrivals")} collection="new-arrivals" />
                </Reveal>
                <Reveal>
                    <PromoBanner />
                </Reveal>
                <Reveal>
                    <WhyNuvora />
                </Reveal>
            </div>
        </MotionPreferences>
    );
}