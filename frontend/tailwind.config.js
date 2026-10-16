/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#FF6B35',
          'primary-hover': '#E85924',
          'primary-light': '#FFE8DF',
          secondary: '#1F2937',
          'secondary-light': '#374151',
          bg: '#FFF9F2',
          accent: '#22C55E',
          'accent-hover': '#16A34A',
          'accent-light': '#DCFCE7',
          muted: '#6B7280',
          border: '#E5E7EB'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'hover': '0 14px 40px rgba(255, 107, 53, 0.15)',
      }
    },
  },
  plugins: [],
}
