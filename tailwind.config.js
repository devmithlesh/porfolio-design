/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0a0e1a',
          panel: '#12182b',
          accent: '#6ee7ff',
          gold: '#fbbf24',
          health: '#22c55e',
          mana: '#3b82f6',
        },
      },
      fontFamily: {
        game: ['"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(110, 231, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(110, 231, 255, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
