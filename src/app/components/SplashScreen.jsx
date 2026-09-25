import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { usePalette, useTheme } from "@/app/theme/ThemeProvider";

// splash.lottie is served from /public/lottie/ as a plain static URL —
// no Vite import needed; this avoids WASM-loader issues in dev mode.
const SPLASH_SRC = "/lottie/splash.lottie";

// ─── Main SplashScreen ───────────────────────────────────────────────────────
export default function SplashScreen({ onComplete, minDuration = 3500 }) {
  const P = usePalette();
  const { dark } = useTheme();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [lottieError, setLottieError] = useState(false);

  // Progress simulation
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / minDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t >= 1) {
        clearInterval(interval);
        setPhase("fadeout");
        setTimeout(onComplete, 800);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <>
      <style>{`
        @keyframes fadeOutSplash {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(8,145,178,0.3), 0 0 24px rgba(8,145,178,0.1); }
          50%       { box-shadow: 0 0 16px rgba(8,145,178,0.5), 0 0 40px rgba(8,145,178,0.2); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.3); }
        }
        @keyframes subtitleReveal {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes lottieReveal {
          0%   { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1);    }
        }
        @keyframes logoReveal {
          0%   { opacity: 0; transform: scale(0.5) rotate(-10deg); filter: blur(20px); }
          60%  { opacity: 1; transform: scale(1.05) rotate(0deg);  filter: blur(0);    }
          100% { opacity: 1; transform: scale(1)    rotate(0deg);  filter: blur(0);    }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: dark
            ? `linear-gradient(160deg, ${P.bg} 0%, ${P.sidebar} 30%, ${P.card} 60%, ${P.bg} 100%)`
            : "linear-gradient(160deg, #F8FAFB 0%, #EFF6F8 30%, #F1F5F9 60%, #F7F8FA 100%)",
          animation:
            phase === "fadeout" ? "fadeOutSplash 0.8s ease-in forwards" : "none",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 480,
            padding: "0 24px",
          }}
        >
          {/* ── Lottie animation (with error fallback) ────────────────────── */}
          {!lottieError ? (
            <div
              style={{
                width: "100%",
                maxWidth: 360,
                animation: "lottieReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
              }}
            >
              <DotLottieReact
                src={SPLASH_SRC}
                loop
                autoplay
                style={{ width: "100%", height: "auto" }}
                onError={() => setLottieError(true)}
              />
            </div>
          ) : (
            /* ── Fallback if lottie fails to load ─────────────────────────── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                animation: "logoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>
                <span style={{ color: P.teal }}>Zodiac</span>
                <span style={{ color: P.navy }}>Pluss</span>
              </div>
              <p style={{ fontSize: 13, color: P.slate, fontWeight: 500, letterSpacing: 0.5, margin: 0 }}>
                Your Personal Wellness Companion
              </p>
            </div>
          )}

          {/* ── Progress bar ─────────────────────────────────────────────── */}
          <div
            style={{
              marginTop: 32,
              width: 240,
              height: 3,
              background: "rgba(8,145,178,0.08)",
              borderRadius: 4,
              overflow: "hidden",
              animation: "subtitleReveal 0.8s ease-out 0.8s both",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${P.teal}, ${P.emerald})`,
                borderRadius: 4,
                transition: "width 0.15s ease-out",
                animation: "progressGlow 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* ── Pulsing dots ─────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 16,
              alignItems: "center",
              animation: "subtitleReveal 0.8s ease-out 1s both",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: P.teal,
                  animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          {/* ── Status text ──────────────────────────────────────────────── */}
          <p
            style={{
              fontSize: 11,
              color: P.slateLight,
              marginTop: 10,
              fontWeight: 400,
              letterSpacing: 0.5,
              animation: "subtitleReveal 0.8s ease-out 1.2s both",
            }}
          >
            Preparing your workspace…
          </p>
        </div>

        {/* ── Bottom watermark ─────────────────────────────────────────────── */}
        <p
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 10,
            color: P.slateLight,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          Your Personal Wellness Companion
        </p>
      </div>
    </>
  );
}
