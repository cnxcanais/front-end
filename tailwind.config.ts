import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-100': '#cecfd1',
        'blue-200': '#9fa2a6',
        'blue-300': '#72777d',
        'blue-400': '#45505a',
        'blue-500': '#072a3c',
        'yellow-100': '#c2a360',
        'yellow-200': '#8a7444',
        'yellow-300': '#453a22',
        'red-error': '#F75A68',
        'green-success': '#00B37E',
      },
    },
  },
  plugins: [],
} satisfies Config
