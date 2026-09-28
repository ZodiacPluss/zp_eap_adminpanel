/**
 * Company sign-in adapter.
 *
 * The login page talks only to this module, so connecting the real backend
 * (from the Swagger/OpenAPI spec) means replacing the bodies below — the page
 * itself does not need to change.
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

export class InvalidCredentialsError extends Error {
  constructor() {
    super("That email and password combination doesn't match an account.");
    this.name = "InvalidCredentialsError";
  }
}

/**
 * TEMPORARY shared credentials for the deployed test environment.
 *
 * These are checked in the browser, so anyone who opens the deployed bundle can
 * read them — this is a placeholder gate for frontend review, NOT security.
 * Delete this constant and the branch in `signInWithPassword` as soon as the
 * real sign-in endpoint is available.
 */
const DEMO_CREDENTIALS = {
  email: "amit@abc.com",
  password: "amit@123",
};

const DEMO_USER = {
  email: DEMO_CREDENTIALS.email,
  name: "Amit Sharma",
  role: "HR Administrator",
};

/**
 * Email + password sign-in.
 *
 * Unlike the SSO path below, this deliberately works in production builds too,
 * because the deployed environment is what is being reviewed.
 */
export async function signInWithPassword(email, password) {
  // TODO(backend): POST these to the sign-in endpoint and return the session
  // it issues, then remove the demo branch below.
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return { type: "session", user: { ...DEMO_USER } };
  }

  throw new InvalidCredentialsError();
}

/**
 * Identity-provider sign-in, kept for when the organization's SSO is wired up.
 * Not currently reachable from the login form.
 */
export async function startCompanySignIn(email) {
  // TODO(backend): look up the organization for `email` and return the SSO
  // redirect URL issued by the API.
  if (import.meta.env.DEV) {
    return { type: "session", user: { email, role: "Super Admin" } };
  }

  throw new AuthNotConfiguredError();
}
