/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./client/src/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))"},
        secondary:{ DEFAULT: "hsl(var(--secondary))", foreground:"hsl(var(--secondary-foreground))"},
        muted:    { DEFAULT: "hsl(var(--muted))", foreground:"hsl(var(--muted-foreground))"},
        accent:   { DEFAULT: "hsl(var(--accent))", foreground:"hsl(var(--accent-foreground))"},
        destructive:{ DEFAULT:"hsl(var(--destructive))", foreground:"hsl(var(--destructive-foreground))"},
        card:     { DEFAULT: "hsl(var(--card))", foreground:"hsl(var(--card-foreground))"},
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};