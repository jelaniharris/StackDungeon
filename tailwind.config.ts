import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary_old: {
          // Customize it on globals.css :root
          50: 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--tw-color-primary-950) / <alpha-value>)',
        },
        dark: '#222222',
        primary: {
          '50': '#f3faf9',
          '100': '#d8efee',
          '200': '#b1dedd',
          '300': '#82c5c6',
          '400': '#58a5a9',
          '500': '#3e898e',
          '600': '#306b71',
          '700': '#2b5a5f',
          '800': '#25464a',
          '900': '#223c3f',
          '950': '#0f2124',
        },
        accent: {
          '50': '#f1fafa',
          '100': '#dcf1f1',
          '200': '#bde4e4',
          '300': '#8ed1d2',
          '400': '#59b4b7',
          '500': '#3e999c',
          '600': '#367d84',
          '700': '#336a71',
          '800': '#2f555b',
          '900': '#2b494e',
          '950': '#182f34',
        },
        text: '#091415',
        background: {
          '50': '#f4fafb',
          '100': '#edf6f7',
          '200': '#cee8e9',
          '300': '#a2d6d7',
          '400': '#71bebf',
          '500': '#4fa8a8',
          '600': '#3c898d',
          '700': '#326e72',
          '800': '#2c5e60',
          '900': '#294e51',
          '950': '#1b3336',
          secondary: '#ffffff',
        },
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
