/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0D1B2A',
        'brand-secondary': '#1B263B',
        'brand-accent': '#38BDF8',
        'brand-light': '#778DA9',
        'brand-lighter': '#E0E1DD',
        'brand-cta': '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    }
  },
  plugins: [],
}