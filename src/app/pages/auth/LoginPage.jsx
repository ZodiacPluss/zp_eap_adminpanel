import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Info, LockKeyhole, Mail } from "lucide-react";
import {
  AuthNotConfiguredError,
  startCompanySignIn,
} from "@/app/services/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BENEFITS = [
  ["Healthier", "Employees"],
  ["Stronger", "Teams"],
  ["More Resilient", "Organizations"],
];

// TODO: point these at the published policy pages once they exist.
const FOOTER_LINKS = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Contact", href: "#contact" },
];

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // Guards against state updates after the page unmounts mid-request.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setNotice("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Enter your work email to continue.");
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await startCompanySignIn(normalizedEmail);

      if (result.type === "redirect") {
        window.location.assign(result.url);
        return;
      }

      onLogin?.(result.user);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(
        err instanceof AuthNotConfiguredError
          ? err.message
          : "We couldn't start sign-in. Please try again."
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleNeedHelp = () => {
    setError("");
    setNotice("For sign-in help, please contact your organization's administrator.");
  };

  const handleOtherProvider = () => {
    setError("");
    setNotice("Signing in with a different identity provider isn't available yet.");
  };

  return (
    <main className="flex min-h-screen w-full flex-col font-['Figtree',system-ui,sans-serif] lg:grid lg:grid-cols-2">
      {/* ── Brand panel ─────────────────────────────────────────────────── */}
      <section
        aria-label="ZodiacPluss Employee Assistance Program"
        className="zp-auth-photo flex flex-col px-6 pb-10 pt-8 text-white sm:px-10 sm:pb-12 lg:min-h-screen lg:px-[17.8%] lg:pb-16 lg:pt-[70px]"
      >
        <p className="text-[24px] font-medium leading-none tracking-[-0.02em] lg:text-[30px]">
          ZodiacPluss
        </p>

        <div className="mt-10 lg:mt-[max(40px,8.3vh)]">
          <p className="text-[10.5px] uppercase tracking-[0.42em] text-white/85 lg:text-[11.5px]">
            Employee Assistance <span className="font-semibold text-white">Program</span>
          </p>

          <h2 className="mt-5 text-[30px] font-light leading-[1.13] lg:leading-[1.085] tracking-[-0.01em] sm:text-[38px] lg:mt-[26px] lg:text-[clamp(34px,3vw,54px)]">
            <span className="text-white">
              Supporting <br className="hidden sm:block" />
              people at work.
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="text-white/75">
              For a better <br className="hidden sm:block" />
              tomorrow.
            </span>
          </h2>

          <p className="mt-4 hidden text-[15px] leading-[25px] lg:mt-3.5 text-white/85 sm:block lg:text-[17px]">
            Comprehensive mental health and wellbeing <br className="hidden xl:block" />
            support for modern organizations.
          </p>

          <div className="mt-11 hidden h-[2px] w-[42px] bg-white/85 md:block" aria-hidden="true" />

          <ul className="mt-12 hidden lg:mt-[46px] text-[15px] lg:text-[16px] leading-[21.5px] text-white/85 md:flex">
            {BENEFITS.map(([first, second]) => (
              <li
                key={second}
                className="whitespace-nowrap border-white/40 px-[clamp(20px,2.3vw,37px)] first:pl-0 last:pr-0 [&:not(:last-child)]:border-r"
              >
                {first}
                <br />
                {second}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Sign-in panel ───────────────────────────────────────────────── */}
      <section
        aria-label="Sign in"
        className="relative flex flex-1 flex-col overflow-hidden bg-[var(--zp-auth-surface)] px-6 pb-8 pt-6 text-[var(--zp-auth-ink)] sm:px-10 lg:min-h-screen lg:pb-[58px] lg:pl-[12.7%] lg:pr-[6.3%] lg:pt-[74px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_28%_105%,var(--zp-auth-glow),transparent_70%)]"
        />

        <div className="relative flex justify-end">
          <button
            type="button"
            onClick={handleNeedHelp}
            className="rounded text-[14px] leading-5 text-[var(--zp-auth-body)] transition hover:text-[var(--zp-auth-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--zp-auth-accent)]"
          >
            Need help?
          </button>
        </div>

        <div className="relative mx-auto mt-8 w-full max-w-[482px] lg:mt-[max(40px,8.4vh)]">
          <header>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--zp-auth-muted)]">
              Company access
            </p>

            <h1 className="mt-5 text-[32px] font-medium leading-[1.15] tracking-[-0.01em] sm:text-[42px]">
              Sign in to your <br className="hidden sm:block" />
              company account
            </h1>

            <p className="mt-4 text-[16px] leading-[1.6] text-[var(--zp-auth-body)] sm:text-[20.5px] sm:leading-[1.45]">
              Use your work email to continue with your{" "}
              <br className="hidden sm:block" />
              organization&apos;s single sign-on (SSO).
            </p>
          </header>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-md border border-[var(--zp-rose)]/30 bg-[var(--zp-rose)]/10 px-3.5 py-2.5 text-[14px] leading-5 text-[var(--zp-rose)]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mt-6 flex items-start gap-2.5 rounded-md bg-[var(--zp-auth-notice)] px-3.5 py-2.5 text-[14px] leading-5 text-[var(--zp-auth-body)]"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--zp-auth-accent)]" aria-hidden="true" />
              <span>{notice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 lg:mt-[35px]">
            <label htmlFor="email" className="block text-[16px] font-medium leading-5">
              Work email
            </label>

            <div className="mt-[9px] flex h-[50px] items-center gap-[19px] rounded-md border border-[var(--zp-auth-field-border)] bg-[var(--zp-auth-field)] px-[18px] transition focus-within:border-[var(--zp-auth-accent)] focus-within:ring-4 focus-within:ring-[var(--zp-auth-accent-ring)]">
              <Mail className="h-5 w-5 shrink-0 text-[var(--zp-auth-body)]" strokeWidth={1.6} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.com"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
                aria-invalid={Boolean(error)}
                className="h-full w-full min-w-0 bg-transparent text-[16px] text-[var(--zp-auth-ink)] outline-none placeholder:text-[var(--zp-auth-placeholder)] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-[23px] flex h-[53px] w-full items-center justify-center gap-4 rounded-md bg-[var(--zp-auth-accent)] text-[19px] font-medium text-white transition hover:bg-[var(--zp-auth-accent-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-auth-accent-ring)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  Continuing…
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-[22px] w-[22px]" strokeWidth={1.8} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <div className="mt-[30px] flex items-center gap-[18px]" aria-hidden="true">
            <span className="h-px flex-1 bg-[var(--zp-auth-line)]" />
            <span className="text-[11px] font-semibold tracking-[0.1em] text-[var(--zp-auth-muted)]">OR</span>
            <span className="h-px flex-1 bg-[var(--zp-auth-line)]" />
          </div>

          <div className="mt-[38px] text-center">
            <button
              type="button"
              onClick={handleOtherProvider}
              disabled={loading}
              className="rounded text-[15px] text-[var(--zp-auth-body)] transition hover:text-[var(--zp-auth-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--zp-auth-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sign in with a different identity provider
            </button>
          </div>
        </div>

        <footer className="relative mt-16 flex flex-col items-center gap-4 text-[13.5px] text-[var(--zp-auth-muted)] sm:flex-row sm:justify-between lg:mt-auto lg:flex-col xl:flex-row lg:pt-12">
          <p className="flex items-center gap-2.5 whitespace-nowrap">
            <LockKeyhole className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
            Protected by enterprise-grade encryption
          </p>

          <nav aria-label="Legal">
            <ul className="flex items-center">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li
                  key={label}
                  className="border-[var(--zp-auth-line)] border-l px-6 leading-4 first:border-l-0 first:pl-0 last:pr-0"
                >
                  <a
                    href={href}
                    className="transition hover:text-[var(--zp-auth-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--zp-auth-accent)]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </footer>
      </section>
    </main>
  );
}
