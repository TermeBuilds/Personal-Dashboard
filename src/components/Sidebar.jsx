import { useLanguage } from '../context/LanguageContext'

export default function Sidebar({ view, onChangeView }) {
  const { t } = useLanguage()
  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: '◆' },
    { id: 'notes', label: t.nav.notes, icon: '◈' },
    { id: 'tasks', label: t.nav.tasks, icon: '▣' },
    { id: 'reports', label: t.nav.reports, icon: '▤' },
  ]

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-base-700 bg-base-900 px-5 py-6 rtl:border-l ltr:border-r">
      <div className="mb-10 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-signal-green font-display text-sm font-bold text-base-950">
          T
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-ink-100">{t.appName}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
            {t.tagline}
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-right font-body text-sm transition-colors ${
              view === item.id
                ? 'bg-base-800 text-ink-100'
                : 'text-ink-500 hover:bg-base-800/60 hover:text-ink-300'
            }`}
          >
            <span className={view === item.id ? 'text-signal-green' : ''}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-md border border-base-700 bg-base-850 p-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          {t.uptime}
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-ink-100">۹۴٪</p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-base-700">
          <div className="h-full w-[94%] rounded-full bg-signal-green" />
        </div>
      </div>
    </aside>
  )
}
