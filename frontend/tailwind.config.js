/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      "space-grotesk": ["Space Grotesk", "sans-serif"],
    },
    extend: {
      backgroundColor: {
        transparent: 'transparent',  // Ensures transparent is recognized by Tailwind
      },
    },
  },
  plugins: [],
};
