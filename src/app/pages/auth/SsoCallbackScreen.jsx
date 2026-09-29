/** Shown while the panel exchanges the SSO handoff code for a session. */
export default function SsoCallbackScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--zp-auth-surface)] font-['Figtree',system-ui,sans-serif] text-[var(--zp-auth-ink)]">
      <div role="status" className="flex flex-col items-center gap-4">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--zp-auth-line)] border-t-[var(--zp-auth-accent)]"
          aria-hidden="true"
        />
        <p className="text-[16px] text-[var(--zp-auth-body)]">Signing you in…</p>
      </div>
    </main>
  );
}
