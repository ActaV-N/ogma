import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#f0f4f8',
          gradient: {
            from: {
              DEFAULT: '#E0F4FF',
              50: '#E0F4FF80',
              100: '#E0F4FF',
              200: '#CCE9FF',
            },
            via: {
              DEFAULT: '#FFE5F1',
              50: '#FFE5F180',
              100: '#FFE5F1',
              200: '#FFD6E9',
            },
            to: {
              DEFAULT: '#F0FFF0',
              50: '#F0FFF080',
              100: '#F0FFF0',
              200: '#E1FFE1',
            },
          },
        },
        button: {
          neutral: {
            background: '#FFFFFF',
            color: '#1E1E1E',
          },
        },
      },
      backgroundImage: {
        'gradient-15': 'linear-gradient(15deg, var(--tw-gradient-stops))',
        'gradient-30': 'linear-gradient(30deg, var(--tw-gradient-stops))',
        'gradient-45': 'linear-gradient(45deg, var(--tw-gradient-stops))',
        'gradient-60': 'linear-gradient(60deg, var(--tw-gradient-stops))',
        'gradient-75': 'linear-gradient(75deg, var(--tw-gradient-stops))',
        'gradient-120': 'linear-gradient(120deg, var(--tw-gradient-stops))',
        'gradient-135': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-150': 'linear-gradient(150deg, var(--tw-gradient-stops))',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'gradient-shift-slow': 'gradient-shift 6s ease infinite',
        'gradient-shift-fast': 'gradient-shift 2s ease infinite',
      },
      backgroundSize: {
        'gradient-animate': '200% 200%',
      },
    },
  },
  plugins: [],
} satisfies Config;
