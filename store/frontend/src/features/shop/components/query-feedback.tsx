"use client";

import { useTranslations } from "next-intl";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/ui/surface";
import { getErrorMessageKey } from "@/lib/api/errors";

interface QueryErrorProps {
    error: unknown;
    onRetry: () => void;
}

export function QueryError({ error, onRetry }: QueryErrorProps) {
    const t = useTranslations("shop.states");
    const tCommon = useTranslations("common");

    return (
        <Surface role="alert" className="flex flex-col items-center gap-3 py-8 text-center">
            <CircleAlert className="size-6 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground">{t(`errors.${getErrorMessageKey(error)}`)}</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
                {tCommon("retry")}
            </Button>
        </Surface>
    );
}

export function EmptyState({ message }: { message: string }) {
    return (
        <Surface className="py-8 text-center text-sm text-muted-foreground">
            <p>{message}</p>
        </Surface>
    );
}