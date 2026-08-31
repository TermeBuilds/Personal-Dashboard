import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 rounded-full border border-base-700 bg-base-850 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-signal-green hover:text-signal-green"
    >
      <span>🌐</span>
      <span>{lang === 'fa' ? 'FA' : 'EN'}</span>
      <span className="text-ink-700">/</span>
      <span className="text-ink-700">{lang === 'fa' ? 'EN' : 'FA'}</span>
    </button>
  )
}
