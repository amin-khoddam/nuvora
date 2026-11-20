import axios from "axios";
import { apiConfig } from "@/config/api";
import { toApiError } from "./errors";

export const apiClient = axios.create({
    baseURL: apiConfig.baseUrl,
    timeout: apiConfig.timeoutMs,
    headers: { Accept: "application/json" },
    paramsSerializer: { indexes: null },
});

apiClient.interceptors.request.use(
    (config) => {
      // Lets the backend localise content. Auth headers would be attached here too.
      if (typeof document !== "undefined") {
        config.headers.set("Accept-Language", document.documentElement.lang);
      }
      return config;
    },
    (error: unknown) => Promise.reject(toApiError(error)),
);

apiClient.interceptors.response.use(
    (response) => response,
    // Every failure leaves the client as an `ApiError`, so callers never inspect Axios internals.
    (error: unknown) => Promise.reject(toApiError(error)),
);