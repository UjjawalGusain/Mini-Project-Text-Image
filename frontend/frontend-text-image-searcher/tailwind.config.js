/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float-random': 'floatRandom 10s ease-in-out infinite',
      },
      keyframes: {
        floatRandom: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-30px, -30px)' },
          '50%': { transform: 'translate(30px, 30px)' },
          '75%': { transform: 'translate(-50px, 50px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
    },
  },
  plugins: [],
}

