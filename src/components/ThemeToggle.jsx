import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 rounded-full border border-base-700 bg-base-850 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-signal-green hover:text-signal-green"
      aria-label="toggle theme"
    >
      <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
    </button>
  )
}
