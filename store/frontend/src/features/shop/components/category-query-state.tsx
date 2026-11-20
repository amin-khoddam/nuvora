"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, QueryError } from "./query-feedback";

const SKELETON_COUNT = 6;

interface CategoryQueryStateProps {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    onRetry: () => void;
}

/** Loading, error and empty states for category containers. */
export function CategoryQueryState({ isPending, isError, error, onRetry }: CategoryQueryStateProps) {
    const t = useTranslations("shop.states");

    if (isPending) {
        return (
            <ul aria-hidden className="flex flex-col gap-2">
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index}>
                        <Skeleton className="h-12 rounded-xl" />
                    </li>
                ))}
            </ul>
        );
    }
    if (isError) return <QueryError error={error} onRetry={onRetry} />;
    return <EmptyState message={t("empty")} />;
}