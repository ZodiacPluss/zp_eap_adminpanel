/**
 * Layout constants and formatting helpers.
 *
 * Colours live in `@/app/theme/palette` and are read through `usePalette()` so
 * they follow the active light/dark theme.
 */

export const GRAD = [
  "linear-gradient(135deg,#0891B2,#0E7490)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#EF4444,#DC2626)",
  "linear-gradient(135deg,#EC4899,#DB2777)",
];

export const avatarGrad = (i) => GRAD[Math.abs(i) % GRAD.length];

export const initials = (n) =>
  n.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const fmtK = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : `${n}`;

export const fmtINR = (n) => {
  const a = Math.abs(n),
    pre = n < 0 ? "-₹" : "₹";
  return a >= 1e7
    ? `${pre}${(a / 1e7).toFixed(2)}Cr`
    : a >= 1e5
    ? `${pre}${(a / 1e5).toFixed(2)}L`
    : a >= 1e3
    ? `${pre}${(a / 1e3).toFixed(1)}K`
    : `${pre}${a}`;
};

export const SIDEBAR_W = 240;
