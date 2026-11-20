"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Skeleton } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";
import { shopRoutes } from "@/config/shop";
import { Link } from "@/i18n/navigation";
import { useCategories } from "../hooks/use-shop-queries";
import { useSwiperNav } from "../hooks/use-swiper-nav";
import { CarouselArrows } from "./carousel-arrows";
import { EmptyState, QueryError } from "./query-feedback";
import { SectionHeader } from "./section-header";
import type { Category } from "../types";

const SKELETON_COUNT = 8;

/** A fraction on small screens hints that the list scrolls; 8 fills the desktop row. */
const SLIDES_PER_VIEW_BREAKPOINTS = {
    560: { slidesPerView: 4.3 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 8 },
} as const;

function CategorySlider({ categories }: { categories: Category[] }) {
    const { swiper, edges, swiperProps } = useSwiperNav();

    return (
        <div className="relative">
            <Swiper
                className="shadow-bleed"
                modules={[A11y]}
                slidesPerView={3.3}
                spaceBetween={12}
                breakpoints={SLIDES_PER_VIEW_BREAKPOINTS}
                {...swiperProps}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} className="h-auto!">
                        <Link
                            href={shopRoutes.category(category.slug)}
                            className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
                        >
                            <Surface padding="none" interactive className="flex h-full flex-col items-center gap-2 p-3">
                                <span className="relative size-16">
                                  {category.image ? <Image src={category.image} alt="" fill sizes="64px" className="object-contain" /> : null}
                                </span>
                                <span className="text-center text-sm font-medium">{category.name}</span>
                            </Surface>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {edges.isLocked ? null : (
                <CarouselArrows
                    onPrevious={() => swiper?.slidePrev()}
                    onNext={() => swiper?.slideNext()}
                    isPreviousDisabled={edges.isBeginning}
                    isNextDisabled={edges.isEnd}
                />
            )}
        </div>
    );
}

export function CategoryGrid({ title }: { title: string }) {
    const t = useTranslations("shop.states");
    const { data: categories, isPending, isError, error, refetch } = useCategories();

    let body;
    if (isPending) {
        body = (
            <ul className="flex gap-3 overflow-hidden" aria-hidden>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index} className="min-w-24 flex-1 basis-24">
                        <Skeleton className="h-28 rounded-2xl" />
                    </li>
                ))}
            </ul>
        );
    } else if (isError) {
        body = <QueryError error={error} onRetry={() => void refetch()} />;
    } else if (categories.length === 0) {
        body = <EmptyState message={t("empty")} />;
    } else {
        body = <CategorySlider categories={categories} />;
    }

    return (
        <section aria-label={title}>
            <SectionHeader title={title} href={shopRoutes.categories} />
            {body}
        </section>
    );
}