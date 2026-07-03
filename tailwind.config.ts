import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#09090b",
          900: "#111114",
          800: "#1b1b20",
          700: "#27272f",
        },
        moss: {
          300: "#b7e4a6",
          400: "#8fd174",
          500: "#68b54f",
        },
      },
      boxShadow: {
        soft: "0 18px 80px rgba(0, 0, 0, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
