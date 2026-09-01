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
        surface: {
          DEFAULT: '#121215',
          subtle: '#18181b',
          muted: '#27272a'
        },
        midnight: {
          DEFAULT: '#4f46e5',
          dark: '#3730a3'
        }
      }
    },
  },
  plugins: [],
};

export default config;
