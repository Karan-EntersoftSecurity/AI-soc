import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0a0f1e",
          light: "#1a2444",
          dark: "#060a14",
        },
        accent: {
          DEFAULT: "#00e5ff",
          light: "#4df0ff",
          dark: "#00b8d4",
        },
        surface: {
          card: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.08)",
        },
        severity: {
          critical: "#ff3b3b",
          high: "#ff6b6b",
          medium: "#ffd166",
          low: "#06d6a0",
        },
        cyber: {
          blue: "#00e5ff",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#00ff88",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "border-glow": "borderGlow 3s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "data-flow": "dataFlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0,229,255,0.15)" },
          "50%": { boxShadow: "0 0 20px rgba(0,229,255,0.3)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(0,229,255,0.15)" },
          "50%": { borderColor: "rgba(0,229,255,0.4)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        dataFlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        "glow-gradient":
          "radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.12) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(168,85,247,0.03) 50%, transparent 100%)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(0,229,255,0.15)",
        "glow-md": "0 0 20px rgba(0,229,255,0.2)",
        "glow-lg": "0 0 40px rgba(0,229,255,0.25)",
        "glow-accent": "0 0 15px rgba(0,229,255,0.4)",
        "inner-glow": "inset 0 1px 0 rgba(0,229,255,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
