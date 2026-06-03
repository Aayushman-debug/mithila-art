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
          50: 'rgb(var(--cream-50) / <alpha-value>)',
          100: 'rgb(var(--cream-100) / <alpha-value>)',
          200: 'rgb(var(--cream-200) / <alpha-value>)',
          300: 'rgb(var(--cream-300) / <alpha-value>)',
          400: 'rgb(var(--cream-400) / <alpha-value>)',
          500: 'rgb(var(--cream-500) / <alpha-value>)',
        },
        earth: {
          400: 'rgb(var(--earth-400) / <alpha-value>)',
          500: 'rgb(var(--earth-500) / <alpha-value>)',
          600: 'rgb(var(--earth-600) / <alpha-value>)',
          700: 'rgb(var(--earth-700) / <alpha-value>)',
          800: 'rgb(var(--earth-800) / <alpha-value>)',
          900: 'rgb(var(--earth-900) / <alpha-value>)',
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
          100: 'rgb(var(--warm-gray-100) / <alpha-value>)',
          205: '#FAF8F5', /* Custom helper for profile items */
          200: 'rgb(var(--warm-gray-200) / <alpha-value>)',
          300: 'rgb(var(--warm-gray-300) / <alpha-value>)',
          400: 'rgb(var(--warm-gray-400) / <alpha-value>)',
          500: 'rgb(var(--warm-gray-500) / <alpha-value>)',
          600: 'rgb(var(--warm-gray-600) / <alpha-value>)',
          700: 'rgb(var(--warm-gray-700) / <alpha-value>)',
          800: 'rgb(var(--warm-gray-800) / <alpha-value>)',
          900: 'rgb(var(--warm-gray-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'accent': ['Noto Sans Devanagari', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, var(--gradient-gold-start) 0%, var(--gradient-gold-middle) 50%, var(--gradient-gold-end) 100%)',
        'gradient-warm': 'linear-gradient(135deg, var(--gradient-warm-start) 0%, var(--gradient-warm-middle) 50%, var(--gradient-warm-end) 100%)',
        'gradient-dark': 'linear-gradient(135deg, var(--gradient-dark-start) 0%, var(--gradient-dark-end) 100%)',
        'gradient-hero': 'linear-gradient(180deg, var(--gradient-hero-start) 0%, var(--gradient-hero-middle) 50%, var(--gradient-hero-end) 100%)',
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
        'glass': '0 8px 32px 0 rgba(var(--earth-500), 0.15)',
        'glass-lg': '0 16px 48px 0 rgba(var(--earth-500), 0.2)',
        'gold': '0 4px 20px rgba(var(--earth-500), 0.3)',
        'warm': '0 10px 40px rgba(var(--earth-900), 0.1)',
        'card': '0 4px 6px -1px rgba(var(--earth-900), 0.05), 0 10px 15px -3px rgba(var(--earth-900), 0.08)',
        'card-hover': '0 10px 25px -3px rgba(var(--earth-500), 0.15), 0 20px 40px -5px rgba(var(--earth-900), 0.12)',
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
