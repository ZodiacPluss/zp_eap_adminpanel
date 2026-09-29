/**
 * Company sign-in through the backend's EAP single sign-on.
 *
 *   1. `getCompanySignInUrl(email)` checks the email belongs to a registered
 *      employer and returns the backend URL that starts SSO. The browser goes
 *      there, through the company's identity provider, and back to
 *      `<panel>/sso-callback?status=success&code=…` (or `status=error&error=…`).
 *   2. `completeSsoSignIn(search)` trades the one-time code for an API token and
 *      confirms the person is an HR admin of their company.
 *
 * Every failure a person can act on is raised as an `AuthError` whose message
 * is safe to show; `describeAuthError` covers the rest.
 */
import { ApiError, apiRequest, apiUrl } from "./apiClient";

/** Must match SSO_CALLBACK_PATH in the backend's src/config/urls.js. */
export const SSO_CALLBACK_PATH = "/sso-callback";

export class AuthError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

// Keyed by the backend's SSO_PUBLIC_ERRORS (src/modules/auth/sso/errors.js).
const SSO_ERROR_MESSAGES = {
  unknown_organization: "We couldn't find a company registered for that email address.",
  sso_not_ready: "Your company's single sign-on is still being set up. Please try again later.",
  access_denied: "Your organization's sign-in service declined the request.",
  account_inactive: "Your account is inactive. Please contact your administrator.",
  account_mismatch: "You were signed in as a different account. Please sign in again.",
  sso_unavailable: "Single sign-on is temporarily unavailable. Please try again later.",
  invalid_state: "Your sign-in took too long and expired. Please try again.",
  authentication_failed: "We couldn't verify your sign-in. Please try again.",
  provider_error: "Your organization's sign-in service returned an error. Please try again.",
};

const GENERIC_ERROR = "We couldn't sign you in. Please try again.";

const ssoError = (code) => new AuthError(SSO_ERROR_MESSAGES[code] ?? GENERIC_ERROR, code);

export function describeAuthError(err) {
  if (err instanceof AuthError) return err.message;
  if (err instanceof ApiError) {
    if (err.code === "API_NOT_CONFIGURED") return "Sign-in isn't configured for this deployment yet.";
    if (err.status === 0) return "We couldn't reach the server. Check your connection and try again.";
    if (err.status === 429) return "Too many sign-in attempts. Please wait a moment and try again.";
  }
  return GENERIC_ERROR;
}

export async function getCompanySignInUrl(email) {
  const { registered } = await apiRequest("/auth/sso/discover", { query: { email } });
  if (!registered) throw ssoError("unknown_organization");
  return apiUrl("/auth/sso", { client: "panel", login_hint: email });
}

export const isSsoCallback = (location = window.location) => location.pathname === SSO_CALLBACK_PATH;

/**
 * @param {string} search the callback's query string
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function completeSsoSignIn(search) {
  const params = new URLSearchParams(search);
  const code = params.get("code");
  if (params.get("status") !== "success" || !code) throw ssoError(params.get("error"));

  let exchange;
  try {
    exchange = await apiRequest("/auth/sso/exchange", { method: "POST", body: { code } });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      throw new AuthError("This sign-in link expired or was already used. Please sign in again.", "handoff_expired");
    }
    throw err;
  }

  const admin = await fetchCompanyAdmin(exchange.token);
  return { token: exchange.token, user: toPanelUser(exchange.account, admin) };
}

/** The signed-in person's HR admin record; rejects if they aren't one. */
export async function fetchCompanyAdmin(token) {
  try {
    return await apiRequest("/eap-admin/me", { token });
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      throw new AuthError(
        "Your account doesn't have access to the company admin panel. Please contact your HR administrator.",
        "not_company_admin"
      );
    }
    throw err;
  }
}

/** True when the API refused the token itself, not just the network. */
export const isSessionRejected = (err) =>
  (err instanceof AuthError && err.code === "not_company_admin") ||
  (err instanceof ApiError && err.status === 401);

function toPanelUser(account, admin) {
  return {
    name: account.name,
    email: account.email,
    role: admin.roleName,
    roleKey: admin.roleKey,
    companyName: admin.companyName,
    permissions: admin.permissions,
    adminId: admin.adminId,
    tenantId: admin.tenantId,
  };
}
