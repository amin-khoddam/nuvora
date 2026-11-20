"use client";

import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Surface } from "@/components/ui/surface";
import { Link } from "@/i18n/navigation";
import { useSwiperNav } from "../hooks/use-swiper-nav";
import type { Category } from "../types";
import { CarouselArrows } from "./carousel-arrows";

/** A fraction on small screens hints that the list scrolls; 8 fills the desktop row. */
const SLIDES_PER_VIEW_BREAKPOINTS = {
    560: { slidesPerView: 4.3 },
    768: { slidesPerView: 6 },
    1024: { slidesPerView: 8 },
} as const;

interface CategorySliderProps {
    categories: Category[];
    getHref: (category: Category) => string;
}

/** Used for the homepage "Shop by Category" and for the sub-categories of a category page. */
export function CategorySlider({ categories, getHref }: CategorySliderProps) {
    const { swiper, edges, swiperProps } = useSwiperNav();

    return (
        <div className="relative">
            <Swiper
                // Remount when the set of categories changes (e.g. navigating one level deeper).
                key={categories.map((category) => category.id).join("|")}
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
                            href={getHref(category)}
                            className="group block h-full rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring"
                        >
                            <Surface padding="none" interactive className="flex h-full flex-col items-center gap-2 p-3">
                <span className="relative grid size-16 place-items-center">
                  {category.image ? (
                      <Image src={category.image} alt="" fill sizes="64px" className="object-contain" />
                  ) : (
                      <LayoutGrid className="size-7 text-muted-foreground" aria-hidden />
                  )}
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