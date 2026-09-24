import React, { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CSS_PALETTE, PALETTES, applyPalette, tooltipStyle } from "./palette";

const STORAGE_KEY = "zp_admin_theme";
const FADE_MS = 320;
// The class outlives the fade so that components which re-render late — the
// charts, mainly — still cross-fade into their new colours instead of snapping.
const FADE_HOLD_MS = 620;

const ThemeContext = createContext(null);

export function readStoredTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage can be unavailable (private mode, blocked cookies) */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* persisting the preference is best-effort */
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);
  const fadeTimer = useRef(null);
  // The theme already committed to the document. `toggleTheme` reads this
  // rather than `theme`, because the state update is deprioritised: two quick
  // clicks would otherwise both see the pre-render value and cancel out.
  const themeRef = useRef(theme);

  /**
   * Repaint the document for `next`.
   *
   * This runs straight from the click handler rather than from an effect: the
   * `--zp-*` variables drive most of the page, so writing them before React
   * re-renders lets the cross-fade start on the very next frame instead of
   * waiting for every chart and table to reconcile.
   */
  const paint = useCallback((next, { animate }) => {
    const root = document.documentElement;
    if (animate) {
      root.classList.add("zp-theme-transition");
      window.clearTimeout(fadeTimer.current);
      fadeTimer.current = window.setTimeout(
        () => root.classList.remove("zp-theme-transition"),
        FADE_HOLD_MS,
      );
    }
    applyPalette(next);
  }, []);

  // First paint only — the boot script in index.html has already set `.dark`,
  // this fills in the custom properties to match.
  useEffect(() => {
    paint(readStoredTheme(), { animate: false });
    return () => window.clearTimeout(fadeTimer.current);
  }, [paint]);

  // The state update is deprioritised: repainting the charts costs a few
  // hundred milliseconds, and blocking on it would eat most of the fade the
  // custom properties have already started.
  const commit = useCallback((next) => {
    themeRef.current = next;
    storeTheme(next);
    paint(next, { animate: true });
    startTransition(() => setThemeState(next));
  }, [paint]);

  const setTheme = commit;

  const toggleTheme = useCallback(() => {
    commit(themeRef.current === "dark" ? "light" : "dark");
  }, [commit]);

  // Follow the OS only while the admin has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return undefined;
    const onChange = (e) => {
      let hasChoice = false;
      try {
        hasChoice = Boolean(localStorage.getItem(STORAGE_KEY));
      } catch {
        hasChoice = false;
      }
      if (hasChoice) return;
      const next = e.matches ? "dark" : "light";
      paint(next, { animate: true });
      startTransition(() => setThemeState(next));
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [paint]);

  const value = useMemo(() => {
    const accents = PALETTES[theme];
    return {
      theme,
      dark: theme === "dark",
      setTheme,
      toggleTheme,
      palette: CSS_PALETTE,
      accents,
      tip: tooltipStyle(accents),
    };
  }, [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/**
 * Colours for ordinary `style` values, as `var(--zp-*)` references.
 *
 * Stable across themes, so elements using it repaint straight from the custom
 * properties without waiting on a React render.
 */
export function usePalette() {
  return useTheme().palette;
}

/**
 * The active theme's literal colours.
 *
 * Needed only where `var()` cannot be used: recharts props, which land on SVG
 * presentation attributes, and `${accent}1a`-style alpha suffixes.
 */
export function useAccents() {
  return useTheme().accents;
}

/** Recharts tooltip style for the active theme. */
export function useTipStyle() {
  return useTheme().tip;
}
