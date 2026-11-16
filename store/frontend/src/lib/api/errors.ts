import axios, { isAxiosError } from "axios";

export type ApiErrorKind = "network" | "timeout" | "client" | "server" | "cancelled" | "unknown";

/** Single error shape the UI deals with, whatever the transport threw. */
export class ApiError extends Error {
    readonly kind: ApiErrorKind;
    readonly status: number | null;
    readonly details: unknown;

    constructor(message: string, kind: ApiErrorKind, status: number | null = null, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.kind = kind;
        this.status = status;
        this.details = details;
    }
}

function extractServerMessage(data: unknown): string | undefined {
    if (typeof data === "object" && data !== null && "message" in data) {
        return typeof data.message === "string" ? data.message : undefined;
    }
    return undefined;
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (axios.isCancel(error)) return new ApiError("Request cancelled", "cancelled");

    if (isAxiosError(error)) {
        if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
            return new ApiError("Request timed out", "timeout");
        }
        if (!error.response) return new ApiError("Network error", "network");

        const { status, data } = error.response;
        return new ApiError(
            extractServerMessage(data) ?? error.message,
            status >= 500 ? "server" : "client",
            status,
            data,
        );
    }

    return new ApiError(error instanceof Error ? error.message : "Unknown error", "unknown");
}

const RETRYABLE_KINDS: readonly ApiErrorKind[] = ["network", "timeout", "server"];
const MAX_RETRIES = 2;

/** Pass as TanStack Query's `retry`: only transient failures are retried. */
export function shouldRetryRequest(failureCount: number, error: unknown): boolean {
    return failureCount < MAX_RETRIES && RETRYABLE_KINDS.includes(toApiError(error).kind);
}

export type ErrorMessageKey = "network" | "timeout" | "server" | "generic";

/** Maps an error to a translation key under `shop.states.errors`. */
export function getErrorMessageKey(error: unknown): ErrorMessageKey {
    const { kind } = toApiError(error);
    return kind === "network" || kind === "timeout" || kind === "server" ? kind : "generic";
}