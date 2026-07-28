/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#111111',
        primary: '#F5F5F5',
        secondary: '#888888',
        accent: '#8B2F3A',
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      keyframes: {
        'film-grain': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -1%)' },
          '20%': { transform: 'translate(1%, -2%)' },
          '30%': { transform: 'translate(-1%, 2%)' },
          '40%': { transform: 'translate(2%, 0%)' },
          '50%': { transform: 'translate(-2%, 1%)' },
          '60%': { transform: 'translate(1%, -1%)' },
          '70%': { transform: 'translate(-1%, -2%)' },
          '80%': { transform: 'translate(2%, 1%)' },
          '90%': { transform: 'translate(-2%, 2%)' },
        },
        'noise': {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.08' },
        }
      },
      animation: {
        'film-grain': 'film-grain 0.5s steps(5) infinite',
        'noise': 'noise 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}