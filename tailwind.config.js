/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        'extra-xs': '0.6rem',
        'extra-xxs': '0.5rem',
      },
      lineHeight: {
        'extra-tight': '0.2',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}