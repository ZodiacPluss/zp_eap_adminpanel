/**
 * Persists the signed-in session (`{ token, user }`) across reloads.
 *
 * Storage can be unavailable (private mode, blocked site data), so every
 * access is guarded and a failure simply means "not signed in".
 */
const STORAGE_KEY = "zp_admin_session";

export function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Sessions saved before the API was connected have no token; drop them.
    if (session?.token && session?.user) return session;
  } catch {
    // Corrupt entry: fall through and clear it.
  }
  clearSession();
  return null;
}

export function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Signed in for this tab only.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored, nothing to clear.
  }
}
