"use client";

import { A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { cn } from "@/lib/utils";
import { useSwiperNav } from "../hooks/use-swiper-nav";
import type { Product } from "../types";
import { CarouselArrows } from "./carousel-arrows";
import { ProductCard } from "./product-card";

/** Highest `slidesPerView` in the breakpoints below; loop needs more slides than this. */
const MAX_SLIDES_PER_VIEW = 4;

interface ProductCarouselProps {
    products: Product[];
    showDiscountBadge?: boolean;
    /** Dims the carousel while fresh data for a new currency is loading. */
    isStale?: boolean;
}

export function ProductCarousel({ products, showDiscountBadge = false, isStale = false }: ProductCarouselProps) {
    const { swiper, swiperProps } = useSwiperNav();

    // With few products there is nothing to scroll to, so loop and arrows are skipped.
    const isScrollable = products.length > MAX_SLIDES_PER_VIEW;

    return (
        <div className="relative">
            <Swiper
                // Remounts when the set of products changes: Swiper's loop clones slides once at init.
                key={products.map((product) => product.id).join("|")}
                className={cn("shadow-bleed transition-opacity", isStale && "opacity-60")}
                modules={[A11y]}
                loop={isScrollable}
                slidesPerView={1.2}
                spaceBetween={16}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: MAX_SLIDES_PER_VIEW },
                }}
                {...swiperProps}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto!">
                        <ProductCard product={product} showDiscountBadge={showDiscountBadge} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {isScrollable ? (
                <CarouselArrows onPrevious={() => swiper?.slidePrev()} onNext={() => swiper?.slideNext()} />
            ) : null}
        </div>
    );
}