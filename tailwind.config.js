const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Nunito\\ Sans', 'Noto\\ Sans\\ TC', ...defaultTheme.fontFamily.sans],
      },
    },
    fontFamily: {
      'title': ['Nunito\\ Sans',  ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
