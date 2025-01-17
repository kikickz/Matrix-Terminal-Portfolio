import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        matrix: {
          light: '#00ff41',
          DEFAULT: '#008f11',
          dark: '#003b00'
        },
        cyber: {
          light: '#67e8f9',
          DEFAULT: '#22d3ee',
          dark: '#0e7490'
        },
        synthwave: {
          light: '#e879f9',
          DEFAULT: '#a21caf',
          dark: '#701a75'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: [],
} satisfies Config