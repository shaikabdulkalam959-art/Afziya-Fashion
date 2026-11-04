/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        night: '#0E0A14',
        plum: { DEFAULT: '#3B1A5A', deep: '#2A1040', soft: '#5B2D86' },
        gold: { DEFAULT: '#C9A24B', light: '#E8CF8E', dark: '#9A7A2E' },
        pearl: '#FAF7F2',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
