"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    alt: string;
}

/** Shared by the gallery and its loading skeleton so they always line up. */
export const GALLERY_MAX_WIDTH_CLASS = "sm:max-w-[500px]";

export function ProductGallery({ images, alt }: ProductGalleryProps) {
    const t = useTranslations("shop.detail");
    const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) return null;

    return (
        <div className="flex min-w-0 w-full flex-col gap-3">
            <Surface padding="none" className={cn("min-w-0 w-full overflow-hidden", GALLERY_MAX_WIDTH_CLASS)}>
                <Swiper
                    className="w-full min-w-0"
                    modules={[A11y, Keyboard]}
                    keyboard
                    onSwiper={setSwiper}
                    onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={image}>
                            <div className="relative aspect-square w-full">
                                <Image
                                    src={image}
                                    alt={index === 0 ? alt : `${alt} (${index + 1})`}
                                    fill
                                    priority={index === 0}
                                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 500px, 100vw"
                                    className="object-contain p-6"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Surface>

            {images.length > 1 ? (
                <ul className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((image, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <li key={image} className="shrink-0">
                                <button
                                    type="button"
                                    aria-label={t("showImage", { index: index + 1 })}
                                    aria-current={isActive}
                                    onClick={() => swiper?.slideTo(index)}
                                    className={cn(
                                        "relative block size-16 overflow-hidden rounded-xl border bg-muted/40 outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring sm:size-20",
                                        isActive ? "border-brand" : "border-border/70 hover:border-brand/40",
                                    )}
                                >
                                    <Image src={image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
}