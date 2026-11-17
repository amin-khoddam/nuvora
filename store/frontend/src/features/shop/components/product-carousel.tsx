"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

/** Highest `slidesPerView` in the breakpoints below; loop needs more slides than this. */
const MAX_SLIDES_PER_VIEW = 4;

const arrowClassName =
    "absolute top-1/2 z-10 -mt-5 hidden size-10 rounded-full shadow-[var(--elevation-soft)] lg:inline-flex";

interface ProductCarouselProps {
    products: Product[];
    showDiscountBadge?: boolean;
    /** Dims the carousel while fresh data for a new currency is loading. */
    isStale?: boolean;
}

export function ProductCarousel({ products, showDiscountBadge = false, isStale = false }: ProductCarouselProps) {
    const t = useTranslations("shop.carousel");
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null);

    // With few products there is nothing to scroll to, so loop and arrows are skipped.
    const isScrollable = products.length > MAX_SLIDES_PER_VIEW;

    return (
        <div className="relative">
            <Swiper
                // Remounts when the set of products changes: Swiper's loop clones slides once at init.
                key={products.map((product) => product.id).join("|")}
                className={cn("-my-4 py-4 transition-opacity", isStale && "opacity-60")}
                modules={[A11y]}
                loop={isScrollable}
                slidesPerView={1.2}
                spaceBetween={16}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: MAX_SLIDES_PER_VIEW },
                }}
                onSwiper={setSwiper}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto!">
                        <ProductCard product={product} showDiscountBadge={showDiscountBadge} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {isScrollable ? (
                <>
                    <Button
                        variant="outline"
                        size="icon-lg"
                        className={cn(arrowClassName, "-start-5")}
                        aria-label={t("previous")}
                        onClick={() => swiper?.slidePrev()}
                    >
                        <ChevronLeft className="rtl:-scale-x-100" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-lg"
                        className={cn(arrowClassName, "-end-5")}
                        aria-label={t("next")}
                        onClick={() => swiper?.slideNext()}
                    >
                        <ChevronRight className="rtl:-scale-x-100" />
                    </Button>
                </>
            ) : null}
        </div>
    );
}