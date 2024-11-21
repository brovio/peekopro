import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sidebar: {
          background: "hsl(var(--sidebar-background))",
          hover: "hsl(var(--sidebar-hover))",
          active: "hsl(var(--sidebar-active))",
        },
        navy: {
          800: "#1a1f2c",
          900: "#0f1117",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "toast-hide": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "toast-slide-in": {
          "0%": { transform: "translateX(calc(100% + 1rem))" },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(100% + 1rem))" },
        },
        "toast-fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateX(0)" },
        },
      },
      animation: {
        "toast-hide": "toast-hide 0.2s ease-in forwards",
        "toast-slide-in": "toast-slide-in 0.5s ease-out forwards",
        "toast-slide-out": "toast-slide-out 0.5s ease-out forwards",
        "toast-fade-out": "toast-fade-out 0.2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;