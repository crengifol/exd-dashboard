/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f2ff',
          100: '#ede8ff',
          200: '#dcd3ff',
          300: '#c3b3ff',
          400: '#a688fc',
          500: '#7048e8',   // violet principal
          600: '#5c36d5',
          700: '#4a27b8',
        },
        // Fondo de la app — blanco lavanda muy suave
        surface: { DEFAULT: '#f2f0f8', subtle: '#f7f5fc' },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(112,72,232,0.06)',
        'card-hover':'0 4px 16px rgba(0,0,0,0.07), 0 16px 40px rgba(112,72,232,0.11)',
        btn:         '0 2px 10px rgba(112,72,232,0.30)',
        'btn-hover': '0 6px 20px rgba(112,72,232,0.40)',
        panel:       '-2px 0 40px rgba(0,0,0,0.10)',
        nav:         '0 2px 8px rgba(112,72,232,0.22)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
