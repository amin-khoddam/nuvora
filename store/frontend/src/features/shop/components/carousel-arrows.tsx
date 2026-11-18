"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const arrowClassName =
    "absolute top-1/2 z-10 -mt-5 hidden size-10 rounded-full shadow-[var(--elevation-soft)] lg:inline-flex";

interface CarouselArrowsProps {
    onPrevious: () => void;
    onNext: () => void;
    isPreviousDisabled?: boolean;
    isNextDisabled?: boolean;
}

/**
 * Desktop-only previous/next buttons. Place inside a `relative` wrapper around
 * the carousel. Chevrons flip in RTL, and `start`/`end` follow the direction.
 */
export function CarouselArrows({
                                   onPrevious,
                                   onNext,
                                   isPreviousDisabled = false,
                                   isNextDisabled = false,
                               }: CarouselArrowsProps) {
    const t = useTranslations("shop.carousel");

    return (
        <>
            <Button
                variant="outline"
                size="icon-lg"
                className={cn(arrowClassName, "-start-5")}
                aria-label={t("previous")}
                disabled={isPreviousDisabled}
                onClick={onPrevious}
            >
                <ChevronLeft className="rtl:-scale-x-100" />
            </Button>
            <Button
                variant="outline"
                size="icon-lg"
                className={cn(arrowClassName, "-end-5")}
                aria-label={t("next")}
                disabled={isNextDisabled}
                onClick={onNext}
            >
                <ChevronRight className="rtl:-scale-x-100" />
            </Button>
        </>
    );
}