module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  // tailwind.config.js
theme: {
  extend: {
    keyframes: {
      'word-roll': {
        // We move exactly 1.2em (the height of one word) per step
        '0%, 12%': { transform: 'translateY(0)' },
        '20%, 28%': { transform: 'translateY(calc(-1.2em * 1))' },
        '40%, 45%': { transform: 'translateY(calc(-1.2em * 2))' },
        '60%, 62%': { transform: 'translateY(calc(-1.2em * 3))' },
        '80%, 78%': { transform: 'translateY(calc(-1.2em * 4))' },
        '100%': { transform: 'translateY(calc(-1.2em * 5))' },
      },
    },
    animation: {
      'word-roll': 'word-roll 12s cubic-bezier(0.85, 0, 0.15, 1) infinite',
    },
  },
},
  plugins: [],
}

