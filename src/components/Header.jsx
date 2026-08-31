import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import EmailBadge from './EmailBadge'

export default function Header() {
  const { t, lang } = useLanguage()
  const today = new Date().toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-100">{t.greeting}</h1>
        <p className="mt-1 font-mono text-xs text-ink-500">{today}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <EmailBadge />
        <LanguageToggle />
        <ThemeToggle />
        <div className="hidden items-center gap-2 rounded-full border border-base-700 bg-base-850 px-3 py-1.5 md:flex">
          <span className="h-2 w-2 rounded-full bg-signal-green animate-blink" />
          <span className="font-mono text-xs text-ink-500">{t.allMonitored}</span>
        </div>
      </div>
    </header>
  )
}
