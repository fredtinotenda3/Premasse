import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#0A2540",
          light: "#0f3460",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C96A",
          pale: "#FDF6E3",
        },
        cream: "#FAFAF8",
        slate: "#4A5568",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;