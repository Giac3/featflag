/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'main': '#EDE8DC',
      },
      fontFamily: {
        LuckiestGuy: ['Luckiest Guy', 'cursive'],
        Raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

