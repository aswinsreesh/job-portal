/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4f6',
          100: '#d4e4ea',
          200: '#a9c5d1',
          300: '#7ea6b8',
          400: '#53879f',
          500: '#356882',
          600: '#2a5368',
          700: '#1B3A4B',
          800: '#152e3b',
          900: '#0f2229',
        },
        accent: {
          50: '#faf3ef',
          100: '#f0e0d6',
          200: '#e1c1ad',
          300: '#d2a284',
          400: '#c9936e',
          500: '#C17F59',
          600: '#a86d4a',
          700: '#8f5c3e',
          800: '#764b33',
          900: '#5d3a28',
        },
        surface: {
          DEFAULT: '#F7F5F2',
          50: '#F7F5F2',
          100: '#EDE9E4',
          200: '#DDD8D1',
          300: '#C9C2B8',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
