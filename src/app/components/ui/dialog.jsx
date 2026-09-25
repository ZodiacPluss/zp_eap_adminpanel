import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "./utils";

export const secondaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--zp-border-strong)] bg-[var(--zp-card)] px-5 text-[14px] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)] active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--zp-brand)]/20";
export const primaryButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--zp-brand)] px-5 text-[14px] font-medium text-[var(--zp-on-accent)] transition-colors hover:bg-[var(--zp-brand-deep)] active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-brand)]/25 disabled:cursor-not-allowed disabled:opacity-50";
export const dangerButton =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--zp-rose)] px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--zp-rose)]/25";

/** Centred modal in the redesigned style. Focus trap, Escape and scroll lock come from Radix. */
export function Modal({ open, onOpenChange, title, description, icon, children, className }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-[rgb(71_85_105/0.35)] dark:bg-black/60" />
        <DialogPrimitive.Content
          className={cn("zp-font data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-32px)] w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--zp-border)] bg-[var(--zp-card)] p-6 shadow-[0_24px_60px_var(--zp-shadow)] outline-none", className)}>
          <div className="flex items-start gap-4 pr-8">
            {icon}
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-[18px] font-semibold text-[var(--zp-navy)]">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1.5 text-[14px] leading-[21px] text-[var(--zp-slate)]">{description}</DialogPrimitive.Description>
            </div>
          </div>
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-[var(--zp-slate)] transition-colors hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Closes the surrounding Modal; renders as a secondary button unless `className` says otherwise. */
export function ModalClose({ className = secondaryButton, children = "Cancel" }) {
  return <DialogPrimitive.Close className={className}>{children}</DialogPrimitive.Close>;
}

/** Yes/no confirmation built on Modal. */
export function ConfirmDialog({ open, onOpenChange, title, description, icon, confirmLabel, destructive = false, onConfirm }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description} icon={icon}>
      <div className="mt-6 flex justify-end gap-3">
        <ModalClose />
        <button type="button" autoFocus onClick={onConfirm} className={destructive ? dangerButton : primaryButton}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
