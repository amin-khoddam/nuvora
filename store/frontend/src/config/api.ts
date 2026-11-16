/**
 * API settings read directly from `process.env` (not from `@/config/env`) so
 * this module stays import-free. Add both variables to the env schema when
 * convenient.
 */
export const apiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://jsonplaceholder.typicode.com",
    timeoutMs: 10_000,
    /** While true, shop reads are served from local mock data (see `features/shop/api`). */
    useMock: process.env.NEXT_PUBLIC_USE_MOCK_API !== "false",
} as const;