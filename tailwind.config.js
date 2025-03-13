/** @type {import('tailwindcss').Config} */
const konstaConfig = require('konsta/config')
module.exports = konstaConfig({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        '23': '23%',
        '239': '239px',
        '24p': '24%',
        '226': '226px',
        '169': '169px',
        '49': '49%',
      },
      height: {
        '279': '279px',
      },
      gridGap: {
        '15px': '15px',
      },
      borderRadius: {
        '15': '15px',
      },
      fontSize: {
        '12px': '12px',
      },
      gap: {
        '10': '10px',
        '5': '5px',
        '15': '15px',

      },
      padding: {
        '15': '15px',
        '10': '10px',
        '5': '5px',
        '23': '23px',
      },
      lineHeight: {
        '17': '17px',
        '15': '15px',
        '32': '32px',
      },
      spacing: {
        '4rem': '1rem',
      },
      screens: {
        'custom': '990px',
        '1440px': '1440px',
        '1370px': '1370px',
        '1366px': '1366px',
        '1024px': '1024px',
        '990px': '990px',
        '768px': '768px',
        '425px': '425px',
        '375px': '375px',
      },
      colors: {
        customColor: 'rgba(118, 137, 148, 1)',
        customgray: 'rgba(255, 255, 255, 0.1)',
        customgreen: '#0192a6',
        customBlue: '#0092a6',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({

      });
    }
  ],
});
