/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFF8F0',
          100: '#F5EBD9',
          200: '#E8D5B5',
          300: '#D4BC8E',
          400: '#C4A76D',
          500: '#B0904A',
        },
        earth: {
          400: '#A67C2E',
          500: '#8B6914',
          600: '#6F5410',
          700: '#5C4400',
          800: '#3D2E00',
          900: '#2D2416',
        },
        mithila: {
          red: '#C62828',
          'red-light': '#E53935',
          orange: '#E65100',
          'orange-light': '#F4721E',
          green: '#2E7D32',
          'green-light': '#43A047',
          blue: '#1565C0',
          'blue-light': '#1E88E5',
          yellow: '#F9A825',
          pink: '#D81B60',
          purple: '#6A1B9A',
        },
        charcoal: '#1A1A1A',
        'warm-black': '#2D2416',
        'warm-gray': {
          100: '#F5F0EB',
          200: '#E5DDD3',
          300: '#C9BDA9',
          400: '#A89880',
          500: '#8A7A62',
          600: '#6B5D49',
          700: '#4D4234',
          800: '#352E23',
          900: '#1F1A12',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'accent': ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #8B6914 0%, #C4A76D 50%, #8B6914 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFF8F0 0%, #F5EBD9 50%, #E8D5B5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #2D2416 0%, #1A1A1A 100%)',
        'gradient-hero': 'linear-gradient(180deg, rgba(45,36,22,0.9) 0%, rgba(45,36,22,0.5) 50%, rgba(45,36,22,0.9) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(1deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(139, 105, 20, 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(139, 105, 20, 0.2)',
        'gold': '0 4px 20px rgba(139, 105, 20, 0.3)',
        'warm': '0 10px 40px rgba(45, 36, 22, 0.1)',
        'card': '0 4px 6px -1px rgba(45, 36, 22, 0.05), 0 10px 15px -3px rgba(45, 36, 22, 0.08)',
        'card-hover': '0 10px 25px -3px rgba(139, 105, 20, 0.15), 0 20px 40px -5px rgba(45, 36, 22, 0.12)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
