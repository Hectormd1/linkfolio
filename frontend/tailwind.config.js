/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "home": "url('/bg.svg')"
      },
      backgroundSize: {
        "home-xl": "50%",
      },
      screens: {
        'max-1300': {'max': '1300px'},
      },
      colors: {
        primary: '#2271dc',
        secondary: '#f68e2a',
        'cyan-400': '#2271dc',
        'blue-400': '#2271dc',
        'cyan-500': '#2271dc',
        'blue-500': '#2271dc',
        'green-400': '#f68e2a',
        'green-500': '#f68e2a',
        'emerald-400': '#f68e2a',
        'emerald-500': '#f68e2a',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
};
