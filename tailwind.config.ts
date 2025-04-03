import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blue: {
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
        error: "#F75A68",
        success: "#00B37E",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config
