import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        heading: ['"Noto Serif"', 'serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "#111416",
          container: "#1d2022",
          "container-low": "#191c1e",
          "container-high": "#272a2c",
          "container-highest": "#323537",
          bright: "#37393c",
        },
        primary: {
          DEFAULT: "#00dbe7",
          foreground: "#002022",
          container: "#002022",
        },
        secondary: {
          DEFAULT: "#c6c6c9",
          foreground: "#2f3133",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#272a2c",
          foreground: "#c4c6cf",
        },
        accent: {
          DEFAULT: "#00dbe7",
          foreground: "#002022",
        },
        popover: {
          DEFAULT: "#1d2022",
          foreground: "#e1e2e5",
        },
        card: {
          DEFAULT: "#191c1e",
          foreground: "#e1e2e5",
        },
        sidebar: {
          DEFAULT: "#111416",
          foreground: "#e1e2e5",
          primary: "#00dbe7",
          "primary-foreground": "#002022",
          accent: "#1d2022",
          "accent-foreground": "#e1e2e5",
          border: "#272a2c",
          ring: "#00dbe7",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "shimmer": "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
