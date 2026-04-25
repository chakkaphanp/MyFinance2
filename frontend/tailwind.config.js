/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Claymorphism - Warm Playful Palette
        'clay-primary': '#FF9F5A',      // Warm Orange
        'clay-secondary': '#FFB366',    // Light Orange
        'clay-accent': '#FFCC66',       // Warm Yellow
        'clay-pink': '#FFB8A3',         // Peachy Pink
        'clay-coral': '#FF6B6B',        // Coral
        'clay-dark': '#5D4037',         // Warm Brown - Text
        'clay-light': '#FFF8F0',        // Warm Cream Background
        'clay-white': '#FFFBF5',        // Off-White
        'clay-gray': '#E8DDD5',         // Warm Gray
        'clay-shadow': 'rgba(255, 159, 90, 0.15)',  // Warm Orange Shadow
      },
      fontFamily: {
        'universal-sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'clay': '24px',
      },
      transitionTimingFunction: {
        'tesla': 'cubic-bezier(0.33, 0, 0.67, 1)',
      },
      animation: {
        'slide-in-down': 'slideInDown 0.33s cubic-bezier(0.33, 0, 0.67, 1)',
      },
      keyframes: {
        slideInDown: {
          'from': { transform: 'translateY(-100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
