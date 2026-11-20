/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parkpin: {
          deepTeal: '#243B3D',
          darkTeal: '#1A2C2E',
          warmIvory: '#F5F3EE',
          mutedTeal: '#789B9A',
          softSand: '#D9BFA3',
          softSage: '#E2ECE9',
          cardBg: '#FFFFFF',
          border: '#E5E1D8',
          subtext: '#6A7E7D'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 8px -2px rgba(36, 59, 61, 0.08), 0 1px 4px -1px rgba(36, 59, 61, 0.04)',
        card: '0 4px 16px -4px rgba(36, 59, 61, 0.08), 0 2px 6px -2px rgba(36, 59, 61, 0.04)',
        floating: '0 12px 28px -6px rgba(36, 59, 61, 0.16), 0 4px 10px -3px rgba(36, 59, 61, 0.08)'
      }
    },
  },
  plugins: [],
}
