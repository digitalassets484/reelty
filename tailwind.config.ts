import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1120",
          soft: "#111a2e",
          muted: "#1c2740",
        },
        brand: {
          DEFAULT: "#2F6BFF",
          dark: "#1E4FD6",
          light: "#5B8CFF",
          glow: "#7AA2FF",
        },
        accent: {
          DEFAULT: "#15E0A4",
          dark: "#0FB487",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,17,32,0.04), 0 8px 24px rgba(11,17,32,0.06)",
        glow: "0 0 0 1px rgba(47,107,255,0.15), 0 12px 40px rgba(47,107,255,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
