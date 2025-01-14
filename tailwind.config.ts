import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/app/(public)/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(authenticated)/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/modules/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        black: {
          100: '#1a1a1a',  
          200: '#0d0d0d',
        },
        blue: {
          100: '#cecfd1',
          200: '#9fa2a6',
          300: '#72777d',
          400: '#45505a',
          500: '#072a3c',
        },
        yellow: {
          100: '#c2a360',
          200: '#8a7444',
          300: '#453a22',
        },
        beige: {
          100: '#e0ccbe',
        },
        white: {
          100: '#ffffff',
        },
        error: '#F75A68',
        success: '#00B37E'
      },
    },
  },
  plugins: [],
} satisfies Config