"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
    const t = useTranslations("shop.detail");
    const [activeIndex, setActiveIndex] = useState(0);
    const activeImage = images[activeIndex] ?? images[0];

    if (!activeImage) return null;

    return (
        <div className="flex flex-col gap-3">
            <Surface padding="none" className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-contain p-6"
                />
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
                                    onClick={() => setActiveIndex(index)}
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