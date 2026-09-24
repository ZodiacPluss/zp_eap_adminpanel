/**
 * Single source of truth for every colour in the admin panel.
 *
 * Each palette is a flat map of plain CSS colour strings (no `var()`), because
 * the same values have to work in three different places:
 *   1. inline `style` objects,
 *   2. recharts props such as `fill` / `stroke`, which land on SVG
 *      presentation attributes where `var()` is not resolved,
 *   3. string concatenation for alpha suffixes (`${P.teal}18`) and gradients —
 *      which is why every accent colour must stay a 6-digit hex.
 *
 * `applyPalette` mirrors the active palette onto `--zp-*` custom properties so
 * Tailwind arbitrary values (`text-[var(--zp-text)]`) stay in sync with it.
 */

export const LIGHT = {
  // Surfaces
  bg: "#F1F5F9",
  card: "#FFFFFF",
  surface: "#F8FAFC",
  sidebar: "#FFFFFF",
  header: "rgba(241,245,249,0.92)",
  overlay: "rgba(12,27,51,0.45)",
  hover: "#F8FAFC",
  // Text
  navy: "#0C1B33",
  slate: "#64748B",
  slateLight: "#94A3B8",
  // Lines
  border: "rgba(12,27,51,0.07)",
  borderStrong: "#E2E8F0",
  // Brand + accents
  teal: "#0891B2",
  tealDark: "#0E7490",
  tealLight: "#E0F2FE",
  brand: "#0D9DA8",
  brandDeep: "#087B82",
  brandSoft: "#E6F4F0",
  emerald: "#10B981",
  amber: "#F59E0B",
  violet: "#8B5CF6",
  rose: "#EF4444",
  // Ink for text sitting on a brand-filled surface
  onAccent: "#FFFFFF",
  // Charts
  grid: "#F1F5F9",
  shadow: "rgba(12,27,51,0.08)",
};

export const DARK = {
  // Surfaces — a neutral black/grey ramp, no blue cast.
  bg: "#0A0A0B",
  card: "#141416",
  surface: "#1C1C1F",
  sidebar: "#0E0E10",
  header: "rgba(10,10,11,0.92)",
  overlay: "rgba(0,0,0,0.66)",
  hover: "#26262A",
  // Text — `navy` keeps its name for continuity with the light palette, but in
  // dark it is a neutral off-white.
  navy: "#EDEDEF",
  slate: "#B2B2B8",
  slateLight: "#86868D",
  // Lines
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",
  // Brand + accents keep their hues — only the neutrals were navy.
  teal: "#22C0D6",
  tealDark: "#1A93A6",
  tealLight: "#173338",
  brand: "#22C7D4",
  brandDeep: "#7FE6EE",
  brandSoft: "#16211F",
  emerald: "#34D399",
  amber: "#FBBF24",
  violet: "#A78BFA",
  rose: "#F87171",
  // The dark accents are bright, so filled brand surfaces carry dark ink.
  onAccent: "#0A0A0B",
  // Charts
  grid: "rgba(255,255,255,0.09)",
  shadow: "rgba(0,0,0,0.6)",
};

const kebab = (key) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export const PALETTES = { light: LIGHT, dark: DARK };

/**
 * The same keys, pointing at the custom properties instead of literal colours.
 *
 * This is what components use for ordinary `style` values. Because the object
 * never changes, a theme switch repaints those elements the moment
 * `applyPalette` writes the variables — it does not wait for React to
 * re-render, which on the chart-heavy pages takes a few hundred milliseconds.
 *
 * Use `useAccents()` instead wherever a literal hex is required: recharts
 * props (SVG presentation attributes do not resolve `var()`) and the
 * `${accent}1a` alpha-suffix tints.
 */
export const CSS_PALETTE = Object.fromEntries(
  Object.keys(LIGHT).map((key) => [key, `var(--zp-${kebab(key)})`]),
);

export function applyPalette(theme) {
  const palette = PALETTES[theme] ?? LIGHT;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--zp-${kebab(key)}`, value);
  }
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  return palette;
}

/** Recharts tooltip chrome, which needs concrete colours per theme. */
export const tooltipStyle = (P) => ({
  borderRadius: 12,
  border: `1px solid ${P.border}`,
  background: P.card,
  color: P.navy,
  boxShadow: `0 8px 32px ${P.shadow}`,
  fontSize: 12,
  padding: "8px 12px",
});

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace("#", "").slice(0, 6);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

/**
 * Pick the label colour for a filled accent swatch.
 *
 * The accents are deliberately brighter in dark mode, which makes white text on
 * amber or emerald unreadable — so the ink is chosen per background instead of
 * being hardcoded to white.
 */
export function readableInk(background) {
  // White stays the default so the established look is preserved wherever it
  // still reads; dark ink only takes over once white drops below ~3:1.
  return 1.05 / (luminance(background) + 0.05) >= 3 ? "#FFFFFF" : "#0A0A0B";
}

const VAR_REF = /^var\(--zp-([a-z0-9-]+)\)$/;

/**
 * Resolve a colour back to a literal hex.
 *
 * Components take colours as props without knowing whether the caller passed a
 * `var(--zp-*)` reference from `usePalette()` or an already-literal value. The
 * few places that cannot use `var()` — alpha suffixes, recharts props — put
 * the value through here first.
 */
export function toLiteral(value, accents) {
  if (typeof value !== "string") return value;
  const match = value.match(VAR_REF);
  if (!match) return value;
  const key = match[1].replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return accents[key] ?? value;
}
