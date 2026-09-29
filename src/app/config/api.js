/**
 * Where the ZodiacPluss API lives.
 *
 * VITE_API_BASE_URL is the API origin only (no `/api/v1`, no trailing slash).
 * Vite bakes it into the bundle at build time, so it is set in
 * `.env.development` locally and as a Cloudflare *build* variable (or
 * `.env.production`) for deploys — a runtime Worker variable has no effect.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");

export const API_PREFIX = "/api/v1";

export const isApiConfigured = () => Boolean(API_BASE_URL);
