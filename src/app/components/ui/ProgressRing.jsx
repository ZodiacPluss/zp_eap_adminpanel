import React, { useId } from "react";

/**
 * Circular progress with content in the middle.
 * `gradient` fades the arc from brand-deep at its start to a lighter teal.
 */
export function ProgressRing({ value, size = 216, stroke = 9, gradient = false, label, className = "", children }) {
  const gradientId = useId();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" role="img" aria-label={label}>
        {gradient && (
          <defs>
            {/* In the pre-rotation frame the arc starts on the right and ends up-left. */}
            <linearGradient id={gradientId} x1="1" y1="0.7" x2="0" y2="0">
              <stop offset="0%" style={{ stopColor: "var(--zp-brand-deep)" }} />
              <stop offset="100%" style={{ stopColor: "var(--zp-teal)", stopOpacity: 0.55 }} />
            </linearGradient>
          </defs>
        )}
        <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={stroke} className="stroke-[var(--zp-brand)]/10" />
        <circle cx={center} cy={center} r={radius} fill="none" strokeWidth={stroke} strokeLinecap="round"
          stroke={gradient ? `url(#${gradientId})` : "var(--zp-brand-deep)"}
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - Math.min(value, 100) / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export default ProgressRing;
