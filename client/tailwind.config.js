/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        midnight:     "#0a0a0f",
        surface:      "#111118",
        card:         "#16161f",
        border:       "#1e1e2e",
        accent:       "#6ee7b7",
        "accent-dim": "#34d399",
        muted:        "#4b5563",
        soft:         "#9ca3af",
      },
    },
  },
  plugins: [],
};
