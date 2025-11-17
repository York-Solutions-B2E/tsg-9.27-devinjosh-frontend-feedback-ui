/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f0ff',
            100: '#e0e0ff',
            500: '#646cff',
            600: '#535bf2',
            700: '#4a52d9',
          },
        },
      },
    },
    plugins: [],
}