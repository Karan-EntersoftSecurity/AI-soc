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
        // EnProbe-inspired palette
        primary: {
          DEFAULT: "#1A2B5B",
          light: "#2C42B0",
          dark: "#0f1a3d",
        },
        accent: {
          DEFAULT: "#00C9C9",
          light: "#4DCAF0",
          dark: "#00a8a8",
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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
