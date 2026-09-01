import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: '#060a12',
          800: '#0d1527',
          700: '#14223d',
          600: '#1e335a',
          500: '#2d4d84',
          accent: '#6366f1',
          cyan: '#06b6d4',
          glow: '#3b82f6',
        }
      }
    },
  },
  plugins: [],
};

export default config;
