/** @type {import('tailwindcss').Config} */
export default {
  content: ['./inertia/**/*.{ts,tsx}', './resources/views/**/*.edge'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a',
        accent: '#3b82f6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
