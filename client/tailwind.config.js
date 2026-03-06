// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        }
      },
      animation: {
        wave: 'wave 3s linear infinite',
      }
    },
  },
  plugins: [],
}