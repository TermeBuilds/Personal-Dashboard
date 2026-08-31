import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

// Raw hex values for places that can't use Tailwind classes (SVG strokes,
// Recharts inline styles). Kept in sync with the CSS variables in index.css.
const PALETTES = {
  dark: {
    track: '#232429',
    grid: '#232429',
    axis: '#55565C',
    tooltipBg: '#121317',
    tooltipBorder: '#232429',
    tooltipText: '#F5F5F7',
    cursor: '#17181D',
    green: '#1DB954',
    red: '#E11D2E',
    amber: '#F5A524',
  },
  light: {
    track: '#E5E7EB',
    grid: '#E5E7EB',
    axis: '#6B7280',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#E5E7EB',
    tooltipText: '#111318',
    cursor: '#F3F4F6',
    green: '#159C46',
    red: '#DC2626',
    amber: '#D97706',
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('terme_theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('terme_theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: PALETTES[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
