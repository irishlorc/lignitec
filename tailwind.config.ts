import type { Config } from 'tailwindcss';

// Colours sampled from the Lignitec logo. Confirm against the brand files.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#629A22', ink: '#3F6A17', soft: '#EDF3E4', light: '#B9DB92' },
        grey: { DEFAULT: '#6B6B6B', ink: '#565A56' },
        beige: { DEFAULT: '#F4EFE6', deep: '#E9E0D0', tan: '#D3C2A4' },
        charcoal: '#1F2420',
        line: '#DDD8CC',
      },
      fontFamily: { sans: ['"DM Sans Variable"', '"Helvetica Neue"', 'Arial', 'sans-serif'] },
      maxWidth: { site: '1280px' },
      borderRadius: { panel: '28px' },
      keyframes: {
        rise: { from: { transform: 'translateY(110%)' }, to: { transform: 'translateY(0)' } },
        pulse2: { '0%': { transform: 'scale(1)', opacity: '.6' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: { rise: 'rise .9s cubic-bezier(.2,.7,.1,1) both', pulse2: 'pulse2 2s ease-out infinite' },
    },
  },
  plugins: [],
};
export default config;
