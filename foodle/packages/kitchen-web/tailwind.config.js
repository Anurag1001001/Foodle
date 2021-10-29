module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'white-two': '#f6f3f3',
        'warm-grey': '#979797',
        'light-royal-blue': '#4352f8',
        'foodle-red': '#ff6666',
        'light-royal-blue-50': 'rgba(67, 82, 248, 0.5)',
        'light-royal-green': '#6CBB71',
        'pale-gold': '#ffd366',
        'warm-grey-two': '#969696',
        'light-peach': 'd6d2d2',
        greyish: '#a7a7a7'
      },
      spacing: {
        15: '3.75rem', // 60px
        16.25: '4.0625rem', // 65px
        17.5: '4.375rem', // 70px
        45: '11.25rem', // 180px
        47.75: '11.9375rem', // 191px
        66.25: '16.5625rem', // 265px
        71.5: '17.875rem', // 286px
        85.75: '21.4375rem', // 343px
        89.25: '22.3125rem', // 357px
        96.25: '24.0625rem', // 385px
        100: '25rem', // 400px
        110: '27.5rem', // 440px
        123.5: '30.875rem', // 494px
        129.75: '32.4375rem', // 519px
        136: '34rem', // 544px
        138: '34.5rem', // 552px
        139: '34.75rem', // 556px
        143: '35.75rem', // 572px
        145: '36.25rem', // 580px
        150: '37.5rem', // 600px
        160: '40rpm', // 640px
        177: '44.25rem' // 708px
      },
      fontSize: {
        '22-lineHeight-1': [
          '22px',
          {
            lineHeight: '1'
          }
        ],
        '12-lineHeight-1': [
          '12px',
          {
            lineHeight: '1'
          }
        ],
        '24-lineHeight-1': [
          '24px',
          {
            lineHeight: '1'
          }
        ],
        '35-lineHeight-1': [
          '35px',
          {
            lineHeight: '1'
          }
        ],
        '11-lineHeight-1': [
          '11px',
          {
            lineHeight: '1'
          }
        ],
        '14-lineHeight-1.43': [
          '14px',
          {
            lineHeight: '1.43'
          }
        ],
        '16-lineHeight-1.43': [
          '16px',
          {
            lineHeight: '1.43'
          }
        ],
        '20-lineheight-1.19': [
          '20px',
          {
            lineHeight: '1.19'
          }
        ],
        '14-lineHeight-1': [
          '14px',
          {
            lineHeight: '1'
          }
        ],
        '16-lineHeight-1.19': [
          '16px',
          {
            lineHeight: '1.19'
          }
        ],
        '30-lineHeight-1.19': [
          '30px',
          {
            lineHeight: '1.19'
          }
        ],
        '16-lineHeight-1.29': [
          '16px',
          {
            lineHeight: '1.29'
          }
        ],
        '14-lineHeight-1.29': [
          '14px',
          {
            lineHeight: '1.29'
          }
        ],
        '16-lineHeight-0.94': [
          '16px',
          {
            lineHeight: '0.94'
          }
        ],
        '13-lineHeight-1.15': [
          '13px',
          {
            lineHeight: '1.15'
          }
        ],
        '24-lineHeight-0.83': [
          '24px',
          {
            lineHeight: '0.83'
          }
        ],
        '26-lineHeight-0.58': [
          '26px',
          {
            lineHeight: '0.58'
          }
        ]
      },
      screens: {
        ipro: '1024px',
        hd: '1366px',
        'hd+': '1536px'
      },
      fontFamily: {
        foodle: ['Helvetica', 'Arial', 'sans-serif'],
        navbar: ['LabGrotesque', 'Avenir', 'FF Dagny', 'sans-serif'],
        brown: ['Brown', 'sans-serif']
      },
      borderRadius: {
        5: '5px'
      },
      borderWidth: {
        6: '6px'
      },
      padding: {
        1: '0.25rem',
        1.5: '0.375rem',
        2: '0.5rem',
        2.5: '0.625rem',
        3: '0.75rem',
        5: '1.25rem',
        5.25: '1.3125rem',
        5.5: '1.375rem',
        6: '1.5rem',
        8: '2rem',
        8.5: '2.125rem',
        10: '2.5rem',
        12: '3rem',
        12.5: '3.125rem',
        13: '3.25rem',
        14: '3.5rem',
        18: '4.5rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        30.5: '7.625rem',
        32: '8rem',
        36: '9rem',
        40: '10rem',
        44: '11rem'
      },
      margin: {
        2: '0.5rem',
        5: '1.25rem',
        5.5: '1.375rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        14.25: '3.5625rem',
        16: '4rem',
        18: '4.5rem',
        20: '5rem',
        24: '6rem',
        28: '7rem',
        30.5: '7.625rem',
        32: '8rem'
      },
      gridTemplateColumns: {
        'min-content': 'min-content auto'
      },
      maxWidth: {
        '1/2': '50%'
      }
    }
  },
  variants: {},
  plugins: []
}
