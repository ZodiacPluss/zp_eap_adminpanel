import { useCallback, useEffect, useState } from "react";
import {
  completeSsoSignIn,
  describeAuthError,
  fetchCompanyAdmin,
  isSessionRejected,
  isSsoCallback,
} from "@/app/services/auth";
import { clearSession, loadSession, saveSession } from "@/app/services/sessionStore";

// The handoff code is single-use, so the exchange must run once per page load
// even if the effect below runs twice (React StrictMode, remounts).
let pendingSignIn = null;
const completeSignInOnce = (search) => (pendingSignIn ??= completeSsoSignIn(search));

/**
 * Owns the signed-in session: restores it on load, finishes an SSO sign-in
 * when the backend redirects back to /sso-callback, and signs out.
 */
export default function useAuthSession() {
  const [callbackSearch] = useState(() => (isSsoCallback() ? window.location.search : null));
  const [restored] = useState(() => (callbackSearch === null ? loadSession() : null));
  const [session, setSession] = useState(restored);
  const [isCompletingSignIn, setIsCompletingSignIn] = useState(callbackSearch !== null);
  const [error, setError] = useState("");

  // Finish the SSO round trip.
  useEffect(() => {
    if (callbackSearch === null) return;
    // Take the one-time code out of the address bar and history right away.
    window.history.replaceState(null, "", "/");

    let cancelled = false;
    completeSignInOnce(callbackSearch)
      .then((next) => {
        if (cancelled) return;
        saveSession(next);
        setSession(next);
      })
      .catch((err) => {
        if (!cancelled) setError(describeAuthError(err));
      })
      .finally(() => {
        if (!cancelled) setIsCompletingSignIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, [callbackSearch]);

  // A restored session is shown straight away, then checked with the API:
  // an expired token or revoked admin access signs out; being offline doesn't.
  useEffect(() => {
    if (!restored) return;
    let cancelled = false;
    fetchCompanyAdmin(restored.token).catch((err) => {
      if (cancelled || !isSessionRejected(err)) return;
      clearSession();
      setSession(null);
      setError("Your session has ended. Please sign in again.");
    });
    return () => {
      cancelled = true;
    };
  }, [restored]);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setError("");
  }, []);

  return {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isCompletingSignIn,
    error,
    logout,
  };
}
