/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sacred: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        maroon: {
          50: '#fdf2f2',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f8b4b4',
          400: '#f98080',
          500: '#e02424',
          600: '#c81e1e',
          700: '#9b1c1c',
          800: '#771d1d',
          900: '#4d1212',
          950: '#2c0b0b',
        },
        parchment: {
          50: '#fffdf9',
          100: '#fdf9ee',
          200: '#faf2d7',
          300: '#f4e5b6',
          400: '#ecd08e',
          500: '#e1b764',
          600: '#cd9a45',
          700: '#ab7834',
          800: '#8b5e2d',
          900: '#724c27',
          950: '#3e2712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Yantramanav', 'sans-serif'],
        serifDevanagari: ['"Rozha One"', '"Noto Serif Devanagari"', 'serif'],
        tiro: ['"Tiro Devanagari Sanskrit"', '"Noto Serif Devanagari"', 'serif'],
        yatra: ['"Yatra One"', '"Noto Serif Devanagari"', 'cursive', 'serif'],
        rozha: ['"Rozha One"', 'serif'],
        notoSerif: ['"Noto Serif Devanagari"', 'serif'],
      },
    },
  },
  plugins: [],
}
