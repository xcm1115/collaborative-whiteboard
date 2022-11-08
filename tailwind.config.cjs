/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'cw-',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-text': '#303133',
        'regular-text': '#606266',
        'secondary-text': '#909399',
        board: '#fdfcff',
      },
    },
  },
  plugins: [],
};
