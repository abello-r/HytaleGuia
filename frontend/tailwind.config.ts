import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'modalSlideIn': 'modalSlideIn 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        modalSlideIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
