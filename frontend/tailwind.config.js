/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dhl: {
          yellow: '#FFCC00',
          red: '#D40511',
          black: '#121212'
        }
      }
    },
  },
  plugins: [],
}
