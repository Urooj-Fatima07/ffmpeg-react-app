/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        aliceblue: 'rgba(199, 219, 235, 0.75)',
        backgroundImage: {
          'gradient-custom': 'linear-gradient(to right, #008080, #800000, #e8025e, #922f92, #808000)',
        },
      },
    },
  },
  plugins: [],
}
