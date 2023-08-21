import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      '2xl': { max: '1535px' },

      xl: { max: '1279px' },

      lg: { max: '1023px' },

      bg: { max: '920px' },

      md: { max: '767px' },

      sm: { max: '639px' },

      xs: { max: '525px' }
    },
    extend: {
      colors: {
        happy: '#FBBD08',
        neutral: '#A9D700',
        sad: '#7CAEFF',
        angry: '#FF6C40',
        button: '#655FB1',
        input: '#F0F2F1'
      },
      opacity: {
        20: '0.2'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
}
export default config
