import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import zodiacLogo from "@/imports/Zodiac_Colored_Logo_croped-removebg-preview.png";
import { useTheme } from "@/app/theme/ThemeProvider";

const AUTHORIZED_EMAIL = "admin@zodiacpluss.com";
const ADMIN_PASSWORD = "password123";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage({ onLogin }) {
  const { dark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const loginTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (loginTimerRef.current) {
        window.clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
    setNotice("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError("");
    setNotice("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    loginTimerRef.current = window.setTimeout(() => {
      const isValidCredentials =
        normalizedEmail === AUTHORIZED_EMAIL &&
        password === ADMIN_PASSWORD;

      setLoading(false);

      if (!isValidCredentials) {
        setError("Invalid email address or password.");
        return;
      }

      const sessionData = {
        email: normalizedEmail,
        role: "Super Admin",
      };

      if (keepSignedIn) {
        localStorage.setItem(
          "zodiacpluss-admin-session",
          JSON.stringify(sessionData)
        );
        sessionStorage.removeItem("zodiacpluss-admin-session");
      } else {
        sessionStorage.setItem(
          "zodiacpluss-admin-session",
          JSON.stringify(sessionData)
        );
        localStorage.removeItem("zodiacpluss-admin-session");
      }

      onLogin?.(sessionData);
    }, 800);
  };

  const handleForgotPassword = () => {
    setError("");
    setNotice(
      "Please contact your administrator to reset your password."
    );
  };

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[image:var(--zp-auth-bg)] px-5 py-8 font-['Inter',system-ui,sans-serif] text-[var(--zp-navy)] sm:px-8 lg:px-12"
      aria-label="ZodiacPluss Admin sign in"
    >
      <button
        type="button"
        onClick={toggleTheme}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={dark}
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[var(--zp-border)] bg-[var(--zp-card)]/70 text-[var(--zp-slate)] backdrop-blur transition hover:text-[var(--zp-brand)] sm:right-8 sm:top-8"
      >
        <Sun className={`absolute h-[18px] w-[18px] transition-all duration-300 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
        <Moon className={`absolute h-[18px] w-[18px] transition-all duration-300 ${dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
      </button>

      <div className="pointer-events-none absolute -left-36 -top-36 h-[420px] w-[420px] rounded-full bg-[var(--zp-auth-blob-a)] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-24 h-[440px] w-[440px] rounded-full bg-[var(--zp-auth-blob-b)] blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--zp-auth-grid)_1px,transparent_1px),linear-gradient(90deg,var(--zp-auth-grid)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="relative w-full max-w-[1120px] lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-20 xl:gap-28">
        <section
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          aria-label="ZodiacPluss"
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 lg:justify-start">
            <img
              src={zodiacLogo}
              alt="ZodiacPluss logo"
              className="h-[72px] w-[72px] shrink-0 object-contain sm:h-20 sm:w-20"
            />

            <div className="text-center sm:text-left">
              <div className="text-[30px] font-extrabold leading-none tracking-[-1.6px] sm:text-[48px] lg:text-[58px]">
                <span>ZodiacPluss</span>
              </div>

              <p className="mt-2 text-[14px] font-semibold  tracking-[0.18em] text-[var(--zp-slate)]">
                Your personal wellness companion
              </p>
            </div>
          </div>

          <div className="mt-12 hidden max-w-[575px] sm:block">


            <h1 className="mt-5 text-5xl font-bold leading-[1.08] tracking-[-2.5px] lg:text-[56px]">
              Make every{" "}
              <span className="text-[var(--zp-brand)]">interaction</span> count.
            </h1>

            <p className="mt-6 md:ml-6 lg:ml-1 max-w-[490px] text-[15px] leading-7 text-[var(--zp-slate)]">
              A focused workspace for supporting members, managing experts,
              and helping more people move towards a healthier, happier life.
            </p>

            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--zp-brand)]/25 bg-[var(--zp-card)]/80 px-4 py-2.5 text-xs font-semibold text-[var(--zp-brand-deep)] shadow-[0_8px_24px_-16px_var(--zp-shadow)]">
              <ShieldCheck className="h-4 w-4 text-[var(--zp-brand)]" aria-hidden="true" />
              A calm, secure place to do meaningful work
            </div>
          </div>
        </section>

        <section
          className="mx-auto mt-10 w-full rounded-[24px] border border-[var(--zp-border)] bg-[var(--zp-card)] p-6 text-center shadow-[0_28px_70px_-28px_var(--zp-shadow)] sm:p-8 lg:mt-0"
          aria-label="Sign in"
        >
          <header>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--zp-brand)]">
                Welcome back
              </p>

              <span className="rounded-full bg-[var(--zp-auth-chip)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--zp-auth-chip-text)]">
                Staff only
              </span>
            </div>

            <h2 className="mt-3 text-[27px] font-bold leading-tight tracking-[-1px] text-[var(--zp-navy)] sm:text-[30px]">
              Sign in to your workspace
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--zp-slate)]">
              Use your authorized ZodiacPluss account to continue.
            </p>
          </header>

          {error && (
            <div
              className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--zp-rose)]/30 bg-[var(--zp-rose)]/12 px-3 py-2.5 text-left text-sm text-[var(--zp-rose)]"
              role="alert"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div
              className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--zp-brand)]/25 bg-[var(--zp-auth-chip)] px-3 py-2.5 text-left text-sm text-[var(--zp-auth-chip-text)]"
              role="status"
            >
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              <span>{notice}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 text-left">
              <FieldLabel htmlFor="email">Email address</FieldLabel>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--zp-border-strong)] bg-[var(--zp-auth-field)] px-3.5 py-3.5 transition focus-within:border-[var(--zp-brand)] focus-within:bg-[var(--zp-card)] focus-within:ring-4 focus-within:ring-[var(--zp-brand)]/15">
                <Mail
                  className="h-5 w-5 shrink-0 text-[var(--zp-slate-light)]"
                  aria-hidden="true"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@zodiacpluss.com"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={loading}
                  className="w-full bg-transparent text-left text-sm text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate-light)] disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <FieldLabel htmlFor="password">Password</FieldLabel>

              <div className="flex items-center gap-3 rounded-xl border border-[var(--zp-border-strong)] bg-[var(--zp-auth-field)] px-3.5 py-3.5 transition focus-within:border-[var(--zp-brand)] focus-within:bg-[var(--zp-card)] focus-within:ring-4 focus-within:ring-[var(--zp-brand)]/15">
                <LockKeyhole
                  className="h-5 w-5 shrink-0 text-[var(--zp-slate-light)]"
                  aria-hidden="true"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  className="w-full bg-transparent text-left text-sm text-[var(--zp-navy)] outline-none placeholder:text-[var(--zp-slate-light)] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((visible) => !visible)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="shrink-0 text-[var(--zp-slate-light)] transition hover:text-[var(--zp-brand)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={() =>
                  setKeepSignedIn((signedIn) => !signedIn)
                }
                disabled={loading}
                aria-pressed={keepSignedIn}
                className="flex items-center gap-2 text-sm font-medium text-[var(--zp-slate)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                    keepSignedIn
                      ? "border-[var(--zp-brand)] bg-[var(--zp-brand)]"
                      : "border-[var(--zp-border-strong)] bg-[var(--zp-card)]"
                  }`}
                >
                  {keepSignedIn && (
                    <Check
                      className="h-3.5 w-3.5 text-[var(--zp-on-accent)]"
                      aria-hidden="true"
                    />
                  )}
                </span>

                Keep me signed in
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-sm font-semibold text-[var(--zp-brand)] transition hover:text-[var(--zp-brand-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex min-h-[52px] items-center justify-center gap-3 rounded-xl bg-[var(--zp-brand)] px-5 text-sm font-bold text-[var(--zp-on-accent)] shadow-[0_14px_26px_-12px_rgba(13,157,168,0.75)] transition hover:-translate-y-0.5 hover:bg-[var(--zp-teal-dark)] hover:shadow-[0_18px_30px_-12px_rgba(13,157,168,0.8)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[var(--zp-auth-chip)] px-3 py-2.5 text-center text-xs font-medium text-[var(--zp-slate)]">
            <ShieldCheck
              className="h-4 w-4 shrink-0 text-[var(--zp-brand)]"
              aria-hidden="true"
            />
            Secure access for authorized ZodiacPluss staff
          </div>
        </section>
      </div>
    </main>
  );
}

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-semibold text-[var(--zp-navy)]"
    >
      {children}
    </label>
  );
}