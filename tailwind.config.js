/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Палитра наследована от stonehedge: warm graphite + sand accent
        ink: {
          950: '#0a0a0b',
          925: '#0e0e10',
          900: '#131316',
          850: '#1a1a1d',
          800: '#26262a',
          700: '#3a3a3f',
          600: '#54545b',
          500: '#7a7a82',
          400: '#9c9ca5',
          300: '#bfbfc7',
          200: '#dcdce1',
          100: '#eeeef0',
          50:  '#f7f7f8',
        },
        sand: {
          700: '#8a7660',
          600: '#a89678',
          500: '#bda88a',
          400: '#cbb89c',
          300: '#d9c9b1',
        },
      },
      fontFamily: {
        sans:    ['Onest', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Chakra Petch"', 'Onest', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.32em',
        wide2: '0.18em',
      },
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
    },
  },
  plugins: [],
};
