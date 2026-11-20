"use client";

import { Slider } from "radix-ui";
import { useDirection } from "@/hooks/use-direction";
import { cn } from "@/lib/utils";

type Range = [number, number];

interface RangeSliderProps {
    min: number;
    max: number;
    step: number;
    value: Range;
    onValueChange: (value: Range) => void;
    /** Fires when the thumb is released; use it to commit to the URL or the API. */
    onValueCommit?: (value: Range) => void;
    /** Accessible names for the lower and upper thumb. */
    thumbLabels: [string, string];
    className?: string;
}

/** Two-thumb range input. Radix handles keyboard, touch and RTL; direction comes from the locale. */
export function RangeSlider({
                                min,
                                max,
                                step,
                                value,
                                onValueChange,
                                onValueCommit,
                                thumbLabels,
                                className,
                            }: RangeSliderProps) {
    const dir = useDirection();

    const toRange = (next: number[]): Range => [next[0] ?? min, next[1] ?? max];

    return (
        <Slider.Root
            dir={dir}
            min={min}
            max={max}
            step={step}
            value={value}
            minStepsBetweenThumbs={1}
            onValueChange={(next) => onValueChange(toRange(next))}
            onValueCommit={(next) => onValueCommit?.(toRange(next))}
            className={cn("relative flex h-5 w-full touch-none items-center select-none", className)}
        >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-muted">
                <Slider.Range className="absolute h-full rounded-full bg-brand" />
            </Slider.Track>
            {thumbLabels.map((label) => (
                <Slider.Thumb
                    key={label}
                    aria-label={label}
                    className="block size-5 rounded-full border-2 border-brand bg-background shadow-[var(--elevation-soft)] outline-none focus-visible:ring-3 focus-visible:ring-ring"
                />
            ))}
        </Slider.Root>
    );
}