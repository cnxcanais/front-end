import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          "50": "#eeeeeeff",
        },
        blue: {
          "50": "#ADD8E6",
          "100": "#cecfd1",
          "200": "#9fa2a6",
          "300": "#72777d",
          "400": "#45505a",
          "500": "#072a3c",
        },
        yellow: {
          "100": "#c2a360",
          "200": "#8a7444",
          "300": "#453a22",
        },
        green: {
          "100": "#00dfa7",
        },
        black: {
          "100": "#242832",
        },
        orange: {
          "50": "#FFDAB3",
          "100": "#FFB566",
          "200": "#FF8A1F",
          "300": "#CC6E19",
          "400": "#995413",
          "500": "#662C0C",
        },
        error: "#F75A68",
        success: "#00B37E",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config
