import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    '../../packages/ui/src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
