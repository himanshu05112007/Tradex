/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b14',
          900: '#0b1329',
          850: '#0f1a38',
          800: '#142247',
          700: '#1d3163',
          600: '#2a4487',
        },
        trade: {
          green: '#10b981',
          'green-light': '#34d399',
          'green-bg': 'rgba(16, 185, 129, 0.1)',
          red: '#ef4444',
          'red-light': '#f87171',
          'red-bg': 'rgba(239, 68, 68, 0.1)',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
};
