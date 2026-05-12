/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tron-black': '#0a0a0f',
        'tron-dark': '#0d1117',
        'tron-panel': '#111827',
        'tron-cyan': '#00f5ff',
        'tron-cyan-dim': '#00b8bf',
        'tron-red': '#ff2020',
        'tron-amber': '#ffaa00',
        'tron-border': '#1a3a3a',
        'tron-text': '#a0c4c4',
        'tron-text-bright': '#e0ffff',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 16px rgba(0, 245, 255, 0.35)',
        'glow-red': '0 0 18px rgba(255, 32, 32, 0.4)',
      },
      animation: {
        pulseCritical: 'pulseCritical 1.4s ease-in-out infinite',
      },
      keyframes: {
        pulseCritical: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
    },
  },
  plugins: [],
}

