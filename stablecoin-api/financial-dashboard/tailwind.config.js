/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fintech-dark': '#0f172a',
        'fintech-darker': '#020617',
        'fintech-blue': '#3b82f6',
        'fintech-green': '#10b981',
        'fintech-red': '#ef4444',
        'fintech-yellow': '#f59e0b',
        'fintech-purple': '#8b5cf6',
      }
    },
  },
  plugins: [],
} 