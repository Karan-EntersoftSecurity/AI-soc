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
        /* Main palette */
        page: "#F5F9FF",
        sidebar: "#F0F6FF",
        card: "#FFFFFF",
        "border-soft": "#E2E8F0",
        "text-primary": "#1F2A44",
        "text-secondary": "#6B7280",
        "hover-highlight": "#DCEBFF",
        "soft-ui-blue": "#E8F2FF",
        primary: {
          DEFAULT: "#1E6BD6",
          light: "#E8F2FF",
          dark: "#1D4ED8",
        },
        accent: {
          DEFAULT: "#1E6BD6",
          light: "#E8F2FF",
          dark: "#1D4ED8",
        },
        /* Buttons & status */
        "btn-primary": "#2563EB",
        "btn-hover": "#1D4ED8",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        /* Charts */
        "chart-primary": "#3B82F6",
        "chart-secondary": "#60A5FA",
        "chart-accent": "#93C5FD",
        surface: {
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        severity: {
          critical: "#EF4444",
          high: "#F59E0B",
          medium: "#EAB308",
          low: "#22C55E",
        },
        cyber: {
          blue: "#1E6BD6",
          purple: "#7C3AED",
          pink: "#EC4899",
          green: "#22C55E",
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
          "0%, 100%": { boxShadow: "0 0 8px rgba(30,107,214,0.12)" },
          "50%": { boxShadow: "0 0 20px rgba(30,107,214,0.2)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(30,107,214,0.2)" },
          "50%": { borderColor: "rgba(30,107,214,0.4)" },
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
          "linear-gradient(rgba(30,107,214,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,107,214,0.04) 1px, transparent 1px)",
        "glow-gradient":
          "radial-gradient(ellipse at 50% 0%, rgba(30,107,214,0.06) 0%, transparent 60%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(30,107,214,0.02) 0%, transparent 100%)",
      },
      backgroundSize: {
        "grid-40": "40px 40px",
      },
      boxShadow: {
        "glow-sm": "0 0 10px rgba(30,107,214,0.1)",
        "glow-md": "0 0 20px rgba(30,107,214,0.15)",
        "glow-lg": "0 0 40px rgba(30,107,214,0.2)",
        "glow-accent": "0 0 15px rgba(30,107,214,0.25)",
        "inner-glow": "inset 0 1px 0 rgba(255,255,255,0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
