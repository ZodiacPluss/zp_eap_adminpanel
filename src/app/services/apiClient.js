/**
 * Thin fetch wrapper for the ZodiacPluss API.
 *
 * The backend answers `{ success: true, data }` on success and
 * `{ success: false, error: { code, message } }` on failure. `apiRequest`
 * returns `data` and turns everything else into an `ApiError`.
 */
import { API_BASE_URL, API_PREFIX, isApiConfigured } from "@/app/config/api";

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number, code?: string }} [details]
   *   `status` is 0 when the request never got a response.
   */
  constructor(message, { status = 0, code = "NETWORK_ERROR" } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function apiUrl(path, query) {
  if (!isApiConfigured()) {
    throw new ApiError("VITE_API_BASE_URL is not set for this build.", { code: "API_NOT_CONFIGURED" });
  }
  const search = query ? `?${new URLSearchParams(query)}` : "";
  return `${API_BASE_URL}${API_PREFIX}${path}${search}`;
}

export async function apiRequest(path, { method = "GET", query, body, token } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(apiUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Couldn't reach the server.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.error?.message || `Request failed with status ${response.status}`, {
      status: response.status,
      code: payload?.error?.code || "HTTP_ERROR",
    });
  }

  return payload?.data;
}
