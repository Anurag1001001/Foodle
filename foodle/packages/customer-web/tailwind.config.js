// eslint-disable-next-line no-unused-vars
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  plugins: [
    require('@tailwindcss/ui')
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F43B24',
        secondary: '#FEE260',
        muted: '#F5F0EB',
        'foodler-black': '#1E1E1E',
        'foodler-white': '#ffffff',
        'input-border-active': '#d6d2d2',
        'warm-gray-light': '#f5f0eb',
        'greyish-brown': '#4e4d4d',
        'foodler-gray': '#cccccc',
        'foodler-blue': '#cfe2f8',
        bubblegum: '#ff92d4',
        tomato: '#f43b24'
      },
      spacing: {
        9.6: '2.4rem'
      }
    },
    borderWidth: {
      default: '1px',
      0: '0',
      2: '1px',
      4: '2px'
    }
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  }
}
