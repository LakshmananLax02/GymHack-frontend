/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // This allows you to use 'font-primary' and 'font-secondary'
        primary: ['var(--font-oswald)', 'sans-serif'],
        secondary: ['var(--font-overpass)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};