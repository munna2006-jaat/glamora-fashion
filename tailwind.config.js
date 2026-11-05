/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glamora: {
          blush: '#F7DDE5',
          rose: '#D98BA5',
          'rose-dark': '#B86A85',
          cream: '#FFF9F6',
          'cream-alt': '#F8F1EB',
          charcoal: '#292329',
          'charcoal-light': '#4A3E4A',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          sand: '#EFE7E1',
          accent: '#E77894',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 35, 41, 0.06)',
        'elevated': '0 10px 30px -4px rgba(217, 139, 165, 0.18)',
        'luxury': '0 20px 40px -10px rgba(41, 35, 41, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}

