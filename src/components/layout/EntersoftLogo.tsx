"use client";

const LOGO_SIZE = 36;

const LOGO_SRC =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_ENTERSOFT_LOGO_URL) ||
  "/entersoft-logo.png";

/**
 * Entersoft logo: shield icon + "ENTERSOFT" text with subtle glow.
 * Uses entersoft-logo.png from public/ if present, else inline SVG.
 */
export function EntersoftLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
        <img
          src={LOGO_SRC}
          alt=""
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          className="object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "block";
          }}
        />
        <svg
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden object-contain"
          style={{ display: "none" }}
          aria-hidden
        >
          <defs>
            <linearGradient
              id="entersoft-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1E6BD6" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
          <path
            d="M8 6 L20 2 L32 6 L32 18 C32 26 20 34 20 34 C20 34 8 26 8 18 Z"
            stroke="url(#entersoft-gradient)"
            strokeWidth="2.5"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M14 14 H26 M14 20 H22 M14 26 H24"
            stroke="url(#entersoft-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span
        className="text-lg font-bold tracking-widest text-text-primary sm:text-xl"
        style={{
          textShadow:
            "0 0 12px rgba(30, 107, 214, 0.15), 0 0 24px rgba(30, 107, 214, 0.08)",
        }}
      >
        ENTERSOFT
      </span>
    </div>
  );
}
