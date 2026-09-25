/**
 * Company sign-in adapter.
 *
 * The login page talks only to this module, so connecting the real backend
 * (from the Swagger/OpenAPI spec) means replacing the body of
 * `startCompanySignIn` — the page itself does not need to change.
 *
 * A result is one of:
 *   { type: "redirect", url }   send the browser to the organization's IdP
 *   { type: "session", user }   already authenticated; `user` is handed to onLogin
 */

export class AuthNotConfiguredError extends Error {
  constructor() {
    super("Single sign-on isn't configured for this environment yet.");
    this.name = "AuthNotConfiguredError";
  }
}

export async function startCompanySignIn(email) {
  // TODO(backend): look up the organization for `email` and return the SSO
  // redirect URL issued by the API.

  // Local development only: `vite dev` signs in without a backend so the
  // dashboard stays reachable. This branch is removed from production builds.
  if (import.meta.env.DEV) {
    return { type: "session", user: { email, role: "Super Admin" } };
  }

  throw new AuthNotConfiguredError();
}
