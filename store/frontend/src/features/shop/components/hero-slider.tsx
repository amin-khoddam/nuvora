"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useHeroSlides } from "../hooks/use-shop-queries";
import { QueryError } from "./query-feedback";

export function HeroSlider() {
    const t = useTranslations("shop.hero");
    const { data: slides, isPending, isError, error, refetch } = useHeroSlides();

    if (isPending) {
        return <Skeleton aria-hidden className="h-80 rounded-3xl" />;
    }
    if (isError) return <QueryError error={error} onRetry={() => void refetch()} />;
    if (slides.length === 0) return null;

    const hasMultipleSlides = slides.length > 1;

    return (
        <section aria-label={t("region")}>
            <Swiper
                className="hero-swiper glass-panel rounded-3xl"
                modules={[A11y, Autoplay, Pagination]}
                rewind
                autoplay={hasMultipleSlides ? { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
                pagination={hasMultipleSlides ? { clickable: true } : false}
                a11y={{ paginationBulletMessage: t("goToSlide") }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative grid min-h-[22rem] items-center bg-linear-to-br from-brand/15 via-accent to-brand-accent/25 sm:min-h-80 sm:grid-cols-2">
                            <div className="relative z-10 flex flex-col items-start gap-4 p-6 pb-4 sm:p-10 sm:pb-12 lg:ps-14">
                                <p className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand">
                                    <Sparkles className="size-3.5" aria-hidden />
                                    {slide.badge}
                                </p>
                                <h2 className="font-display text-3xl font-bold text-balance sm:text-5xl">{slide.title}</h2>
                                <p className="max-w-sm text-base whitespace-pre-line text-muted-foreground sm:text-xl">
                                    {slide.subtitle}
                                </p>
                                <Button
                                    asChild
                                    size="xl"
                                    className="rounded-full bg-foreground text-background hover:bg-foreground/85"
                                >
                                    <Link href={slide.ctaHref}>
                                        {slide.ctaLabel}
                                        <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" aria-hidden />
                                    </Link>
                                </Button>
                            </div>

                            <div className="relative h-52 pb-6 sm:h-full sm:min-h-80 sm:pb-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.imageAlt}
                                    fill
                                    priority={index === 0}
                                    sizes="(min-width: 640px) 50vw, 100vw"
                                    className="object-contain object-center p-4"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}