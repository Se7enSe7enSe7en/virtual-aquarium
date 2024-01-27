/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'hunger-bar': 'hunger-bar 15s linear infinite',
      },
      keyframes: {
        'hunger-bar': {
          '0%': { width: '100%', "background-color": 'greenyellow'},
          '100%': { width: '0%', "background-color": 'orangered' }
        },
      }
    },
  },
  plugins: ["@tailwindcss/typography"],
}

