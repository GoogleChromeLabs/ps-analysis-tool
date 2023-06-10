/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./packages/**/src/**/*.{tsx,js}'],
  theme: {
    extend: {},
    fontFamily: {
      normal: ['"Inter"', 'normal'],
    },
    textColor: {
      ...colors,
      primary: '#000',
      secondary: '#5F5F5F',
      'first-party': '#5FA569',
      'third-party': '#FA752E',
    },
    backgroundColor: {
      ...colors,
      primary: '#FFF',
      secondary: '#E5E7EB',
      tertiary: '#CBD5E1',
    },
  },
  plugins: [],
};
