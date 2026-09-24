import React, { useState, useEffect, useRef, useCallback } from "react";
import zodiacLogo from "@/imports/Zodiac_Colored_Logo_croped-removebg-preview.png";
import { usePalette, useAccents, useTheme } from "@/app/theme/ThemeProvider";

// ─── Zodiac SVG symbols (inline for zero-dependency) ─────────────────────────
const ZODIAC_SYMBOLS = [
  { name: "Aries", viewBox: "0 0 24 24", path: "M12 2C9.5 2 7.5 4 7.5 6.5c0 2 1 3.5 2.5 4.5V22h4V11c1.5-1 2.5-2.5 2.5-4.5C16.5 4 14.5 2 12 2z" },
  { name: "Taurus", viewBox: "0 0 24 24", path: "M7 4c0 2.5 2.2 4.5 5 4.5S17 6.5 17 4M8 8.5C5.8 10.2 4.5 13 4.5 16c0 4 3.4 6 7.5 6s7.5-2 7.5-6c0-3-1.3-5.8-3.5-7.5" },
  { name: "Gemini", viewBox: "0 0 24 24", path: "M6 3h12M6 21h12M8 3v18M16 3v18M8 12h8" },
  { name: "Cancer", viewBox: "0 0 24 24", path: "M9 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM3 9c0 5 4 6 9 6M21 15c0-5-4-6-9-6" },
  { name: "Leo", viewBox: "0 0 24 24", path: "M12 4a4 4 0 0 0-4 4c0 2.2 1.8 4 4 4s4-1.8 4-4a4 4 0 0 0-4-4zm0 10c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2z" },
  { name: "Virgo", viewBox: "0 0 24 24", path: "M8 3v12c0 2.2 1.8 4 4 4h1m-1-16v12m4-12v8c0 2 1.5 4 3 4M12 3v0M16 3v0M8 3v0" },
  { name: "Libra", viewBox: "0 0 24 24", path: "M4 18h16M7 14a5 5 0 0 1 10 0M12 14V6m-3 2a3 3 0 0 1 6 0" },
  { name: "Scorpio", viewBox: "0 0 24 24", path: "M8 3v14m4-14v14m4-14v10c0 2 2 4 4 2l-2-2m2 2l-2 2M8 3v0M12 3v0M16 3v0" },
  { name: "Sagittarius", viewBox: "0 0 24 24", path: "M4 20L20 4m0 0h-8m8 0v8M10 14l-6 6" },
  { name: "Capricorn", viewBox: "0 0 24 24", path: "M8 3v10c0 3.3 2.7 6 6 6h2c2.2 0 4-1.8 4-4s-1.8-4-4-4h-2" },
  { name: "Aquarius", viewBox: "0 0 24 24", path: "M3 9l3-3 3 3 3-3 3 3 3-3 3 3M3 16l3-3 3 3 3-3 3 3 3-3 3 3" },
  { name: "Pisces", viewBox: "0 0 24 24", path: "M7 3c0 9 0 9 0 18M17 3c0 9 0 9 0 18M4 12h16" },
];

// Constellation patterns (pairs of stars connected by lines)
function generateConstellations(count) {
  const constellations = [];
  const patterns = [
    // Triangle
    { stars: [{ x: 0, y: -20, size: 2.5 }, { x: -18, y: 15, size: 2 }, { x: 18, y: 15, size: 2 }], lines: [[0, 1], [1, 2], [2, 0]] },
    // Diamond
    { stars: [{ x: 0, y: -22, size: 2.5 }, { x: -16, y: 0, size: 2 }, { x: 0, y: 22, size: 2 }, { x: 16, y: 0, size: 2 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },
    // W shape
    { stars: [{ x: -20, y: -10, size: 2 }, { x: -10, y: 10, size: 2.5 }, { x: 0, y: -10, size: 2 }, { x: 10, y: 10, size: 2.5 }, { x: 20, y: -10, size: 2 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
    // Cross
    { stars: [{ x: 0, y: -18, size: 2 }, { x: 0, y: 18, size: 2 }, { x: -18, y: 0, size: 2 }, { x: 18, y: 0, size: 2 }, { x: 0, y: 0, size: 3 }], lines: [[0, 4], [4, 1], [2, 4], [4, 3]] },
    // Zigzag
    { stars: [{ x: -18, y: -12, size: 2 }, { x: -6, y: 8, size: 2 }, { x: 6, y: -8, size: 2.5 }, { x: 18, y: 12, size: 2 }], lines: [[0, 1], [1, 2], [2, 3]] },
    // Arc
    { stars: [{ x: -20, y: 8, size: 2 }, { x: -10, y: -8, size: 2 }, { x: 0, y: -14, size: 2.5 }, { x: 10, y: -8, size: 2 }, { x: 20, y: 8, size: 2 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  ];
  for (let i = 0; i < count; i++) {
    const p = patterns[i % patterns.length];
    constellations.push({
      ...p,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      opacity: 0.08 + Math.random() * 0.12,
      scale: 0.8 + Math.random() * 1.2,
      rotation: Math.random() * 360,
    });
  }
  return constellations;
}

// Floating particles generator
function generateParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    opacity: 0.15 + Math.random() * 0.35,
    speed: 0.2 + Math.random() * 0.5,
    angle: Math.random() * Math.PI * 2,
    drift: 0.1 + Math.random() * 0.3,
  }));
}

// ─── Zodiac Background Symbol component ──────────────────────────────────────
function ZodiacBgSymbol({ symbol, x, y, size, opacity, delay, drift }) {
  return (
    <svg
      viewBox={symbol.viewBox}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        opacity,
        transform: "translate(-50%, -50%)",
        animation: `zodiacFloat ${8 + drift * 4}s ease-in-out ${delay}s infinite alternate, zodiacFadeIn 1.5s ease-out ${delay * 0.5}s both`,
        filter: "blur(0.3px)",
      }}
      fill="none"
      stroke="rgba(148, 163, 184, 0.22)"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={symbol.path} />
    </svg>
  );
}

// ─── Main SplashScreen ───────────────────────────────────────────────────────
export default function SplashScreen({ onComplete, minDuration = 3500 }) {
  const P = usePalette();
  const A = useAccents();
  const { dark } = useTheme();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading");
  const constellationsRef = useRef(generateConstellations(14));
  const particlesRef = useRef(generateParticles(40));
  const canvasRef = useRef(null);
  const animFrameRef = useRef(0);

  // Background symbols layout (scattered zodiac icons)
  const bgSymbols = useRef(
    ZODIAC_SYMBOLS.map((s, i) => ({
      symbol: s,
      x: 8 + (i % 4) * 25 + (Math.random() - 0.5) * 15,
      y: 8 + Math.floor(i / 4) * 30 + (Math.random() - 0.5) * 15,
      size: 28 + Math.random() * 28,
      opacity: 0.06 + Math.random() * 0.08,
      delay: i * 0.15,
      drift: Math.random(),
    }))
  ).current;

  // Canvas particle animation
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    particlesRef.current.forEach((p) => {
      p.x += Math.cos(p.angle) * p.drift * 0.02;
      p.y += Math.sin(p.angle) * p.drift * 0.02;
      p.angle += 0.003;
      if (p.x < -2) p.x = 102;
      if (p.x > 102) p.x = -2;
      if (p.y < -2) p.y = 102;
      if (p.y > 102) p.y = -2;

      const px = (p.x / 100) * w;
      const py = (p.y / 100) * h;

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(8, 145, 178, ${p.opacity * 0.5})`;
      ctx.fill();

      // Star glow
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
      gradient.addColorStop(0, `rgba(8, 145, 178, ${p.opacity * 0.3})`);
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    animFrameRef.current = requestAnimationFrame(animateParticles);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);
      animFrameRef.current = requestAnimationFrame(animateParticles);
      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animFrameRef.current);
      };
    }
  }, [animateParticles]);

  // Progress simulation
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / minDuration, 1);
      // Eased progress (fast start, slow end)
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
        @keyframes zodiacFloat {
          0% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
          100% { transform: translate(-50%, -50%) translateY(-12px) rotate(4deg); }
        }
        @keyframes zodiacFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.5) rotate(-10deg); filter: blur(20px); }
          60% { opacity: 1; transform: scale(1.05) rotate(0deg); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(20px); letter-spacing: 12px; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 3px; }
        }
        @keyframes subtitleReveal {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 0.7; transform: translateY(0); }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(8,145,178,0.3), 0 0 24px rgba(8,145,178,0.1); }
          50% { box-shadow: 0 0 16px rgba(8,145,178,0.5), 0 0 40px rgba(8,145,178,0.2); }
        }
        @keyframes ringPulse {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%,-50%) scale(1.15); opacity: 0.08; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0.3; }
        }
        @keyframes ringPulse2 {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%,-50%) scale(1.25); opacity: 0.03; }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0.15; }
        }
        @keyframes orbitSpin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
        @keyframes constellationDrift {
          0% { transform: translate(-50%,-50%) rotate(var(--rot)) translateY(0); }
          50% { transform: translate(-50%,-50%) rotate(var(--rot)) translateY(-6px); }
          100% { transform: translate(-50%,-50%) rotate(var(--rot)) translateY(0); }
        }
        @keyframes fadeOutSplash {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 12px rgba(8,145,178,0.1)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 8px 24px rgba(8,145,178,0.25)); }
        }
        @keyframes outerWheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
          animation: phase === "fadeout" ? "fadeOutSplash 0.8s ease-in forwards" : "none",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Canvas for animated particles */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
        />

        {/* Constellation SVG patterns */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
        >
          {constellationsRef.current.map((c, i) => (
            <g
              key={i}
              style={{
                "--rot": `${c.rotation}deg`,
                animation: `constellationDrift ${10 + i * 2}s ease-in-out ${i * 0.3}s infinite`,
                transformOrigin: `${c.x}% ${c.y}%`,
              }}
            >
              {c.lines.map(([a, b], li) => (
                <line
                  key={li}
                  x1={`${c.x + c.stars[a].x * c.scale * 0.08}%`}
                  y1={`${c.y + c.stars[a].y * c.scale * 0.08}%`}
                  x2={`${c.x + c.stars[b].x * c.scale * 0.08}%`}
                  y2={`${c.y + c.stars[b].y * c.scale * 0.08}%`}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                  style={{ animation: `zodiacFadeIn 2s ease-out ${i * 0.2 + li * 0.1}s both` }}
                />
              ))}
              {c.stars.map((s, si) => (
                <circle
                  key={si}
                  cx={`${c.x + s.x * c.scale * 0.08}%`}
                  cy={`${c.y + s.y * c.scale * 0.08}%`}
                  r={s.size * c.scale * 0.6}
                  fill={`rgba(8,145,178,${c.opacity + 0.05})`}
                  style={{ animation: `zodiacFadeIn 1.5s ease-out ${i * 0.2 + si * 0.15}s both` }}
                />
              ))}
            </g>
          ))}
        </svg>

        {/* Background zodiac symbols */}
        {bgSymbols.map((s, i) => (
          <ZodiacBgSymbol key={i} {...s} />
        ))}

        {/* Soft radial gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: dark
              ? `radial-gradient(ellipse 60% 50% at 50% 45%, ${A.card}cc 0%, transparent 70%)`
              : "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255,255,255,0.85) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Center content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 640 }}>
          {/* Horizontal Brand Panel (Logo Wheel + Text side-by-side) */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, animation: "logoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
            {/* Spinning/Static Masked Zodiac Logo Container */}
            <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}>
              {/* Outer Rotating Constellation Wheel (Masked) */}
              <img
                src={zodiacLogo}
                alt="Zodiac Outer Wheel"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  WebkitMaskImage: "radial-gradient(circle, transparent 52%, black 53%)",
                  maskImage: "radial-gradient(circle, transparent 52%, black 53%)",
                  animation: "outerWheelSpin 28s linear infinite",
                }}
              />
              {/* Inner Static Face & Lotus (Clipped) */}
              <img
                src={zodiacLogo}
                alt="Zodiac Inner Face"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  clipPath: "circle(53% at 50% 50%)",
                }}
              />
            </div>

            {/* Text logo & slogan */}
            <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", fontSize: 44, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.05, fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: P.teal }}>Zodiac</span>
                <span style={{ color: P.navy, position: "relative" }}>
                  Pluss
                  {/* Lotus emblem on top right of Pluss */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={A.teal} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", top: -2, right: -16 }}>
                    <path d="M12 21c-1.5-1.5-2.5-3.2-3-5 .6-.2 1.2-.2 1.8 0 .6.2 1 .6 1.2 1.2.6-.2 1.2-.2 1.8 0-.5 1.8-1.5 3.5-3 5zm-3.5-6.5c-1-1.5-1.5-3.2-1.5-5 1.5.5 2.5 1.5 3 3 .5-1.5 1.5-2.5 3-3 0 1.8-.5 3.5-1.5 5h-3zm7 0c-1-1.5-1.5-3.2-1.5-5 1.5.5 2.5 1.5 3 3 .5-1.5 1.5-2.5 3-3 0 1.8-.5 3.5-1.5 5h-3z" />
                  </svg>
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: P.slate, margin: "6px 0 0", fontWeight: 500, letterSpacing: 0.5 }}>
                Your Personal Wellness Companion
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div
            style={{
              marginTop: 64,
              width: 240,
              height: 3,
              background: "rgba(8,145,178,0.08)",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
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

          {/* Loading status section */}
          <div style={{ display: "flex", gap: 6, marginTop: 16, alignItems: "center", animation: "subtitleReveal 0.8s ease-out 1s both" }}>
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

        {/* Bottom brand watermark */}
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
