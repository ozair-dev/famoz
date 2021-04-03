module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
    	"berkshire":['Berkshire Swash', 'cursive'],
    	'kiwi': ['Kiwi Maru', 'serif']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
