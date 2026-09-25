import React, { useEffect, useState } from "react";
import { CircleCheck, Headset } from "lucide-react";
import { Modal, ModalClose, primaryButton } from "@/app/components/ui/dialog";
import { Field, SelectField, fieldBase, fieldBorder } from "@/app/components/ui/FormField";

const TOPICS = ["Plan customization", "Employee access", "Billing & renewal", "Technical issue", "Something else"];
const MESSAGE_LIMIT = 500;

/**
 * Message to the ZodiacPluss support team. Frontend-only for now: the message
 * is validated and acknowledged, and will be sent once the support API exists.
 */
export default function ContactSupportDialog({ open, onOpenChange, defaultTopic = TOPICS[0] }) {
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setTopic(defaultTopic);
      setMessage("");
      setError("");
      setSent(false);
    }
  }, [open, defaultTopic]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Tell us what you need help with.");
      return;
    }
    // TODO(backend): send { topic, message } to the support endpoint.
    setSent(true);
  };

  const icon = (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--zp-brand)]/10 text-[var(--zp-brand-deep)]">
      {sent ? <CircleCheck className="h-5 w-5" aria-hidden="true" /> : <Headset className="h-5 w-5" aria-hidden="true" />}
    </span>
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange} icon={icon}
      title={sent ? "Message ready" : "Contact Support"}
      description={sent
        ? "Your message is saved. It will be delivered to the ZodiacPluss team as soon as support messaging is connected."
        : "Our team is here for you. Tell us what you need and we'll get back to you."}>
      {sent ? (
        <div className="mt-6 flex justify-end"><ModalClose className={primaryButton}>Done</ModalClose></div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
          <Field id="support-topic" label="Topic">
            <SelectField id="support-topic" value={topic} onChange={(e) => setTopic(e.target.value)} options={TOPICS} />
          </Field>
          <Field id="support-message" label="Message" required error={error}>
            <textarea id="support-message" rows={4} maxLength={MESSAGE_LIMIT} value={message}
              onChange={(e) => { setMessage(e.target.value); setError(""); }} aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? "support-message-error" : undefined} placeholder="Describe your question or request..."
              className={`${fieldBase} ${fieldBorder(Boolean(error))} h-[110px] resize-none px-3.5 py-2.5 text-[13.5px]`} />
          </Field>
          <div className="mt-2 flex justify-end gap-3">
            <ModalClose />
            <button type="submit" className={primaryButton}>Send Message</button>
          </div>
        </form>
      )}
    </Modal>
  );
}
