import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Short confirmation at the bottom of the screen. `toast` is
 * `{ message, action?: { label, onClick } }`; it clears itself after 5s.
 * Portalled so `fixed` is relative to the viewport even inside the
 * animated (transformed) page wrapper.
 */
export function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  return createPortal(
    <div role="status" aria-live="polite" className="zp-font pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      {toast && (
        <div className="pointer-events-auto flex max-w-[520px] items-center gap-4 rounded-xl bg-[var(--zp-navy)] px-4 py-3 text-[13.5px] text-[var(--zp-card)] shadow-[0_12px_32px_var(--zp-shadow)]">
          <span>{toast.message}</span>
          {toast.action && (
            <button type="button" onClick={() => { toast.action.onClick(); onDismiss(); }} className="shrink-0 font-semibold text-[var(--zp-brand)] hover:underline">
              {toast.action.label}
            </button>
          )}
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}

export default Toast;
