/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: 'rgb(var(--c-base-950) / <alpha-value>)',
          900: 'rgb(var(--c-base-900) / <alpha-value>)',
          850: 'rgb(var(--c-base-850) / <alpha-value>)',
          800: 'rgb(var(--c-base-800) / <alpha-value>)',
          700: 'rgb(var(--c-base-700) / <alpha-value>)',
          600: 'rgb(var(--c-base-600) / <alpha-value>)',
        },
        ink: {
          100: 'rgb(var(--c-ink-100) / <alpha-value>)',
          300: 'rgb(var(--c-ink-300) / <alpha-value>)',
          500: 'rgb(var(--c-ink-500) / <alpha-value>)',
          700: 'rgb(var(--c-ink-700) / <alpha-value>)',
        },
        signal: {
          green: 'rgb(var(--c-signal-green) / <alpha-value>)',
          greenDim: 'rgb(var(--c-signal-greendim) / <alpha-value>)',
          red: 'rgb(var(--c-signal-red) / <alpha-value>)',
          amber: 'rgb(var(--c-signal-amber) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgb(var(--c-base-700)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--c-base-700)) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.25 },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rise: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        blink: 'blink 1.6s ease-in-out infinite',
        ticker: 'ticker 22s linear infinite',
        rise: 'rise 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
