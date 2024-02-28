import defaultTheme from 'tailwindcss/defaultTheme';
export const content = ['./src/**/*.{js,html}'];
export const theme = {
  extend: {
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
};
export const plugins = [];