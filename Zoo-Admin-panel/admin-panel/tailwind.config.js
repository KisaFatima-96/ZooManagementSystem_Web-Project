/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],


  theme: {
    extend: {
      colors: {
        primary: "#2D5A27",
        secondary: "#8B4513",
        accent: "#F4A460",
      },
    },
  },
  plugins: [],
}
