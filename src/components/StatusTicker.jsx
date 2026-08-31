import { useSelector } from 'react-redux'
import { useLanguage } from '../context/LanguageContext'

export default function StatusTicker() {
  const log = useSelector((state) => state.dashboard.log)
  const { t } = useLanguage()

  const dotColor = {
    green: 'bg-signal-green',
    amber: 'bg-signal-amber',
    red: 'bg-signal-red',
  }

  if (log.length === 0) {
    return (
      <div className="flex items-center gap-3 border-b border-base-700 bg-base-900 px-4 py-2">
        <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-500">
          <span className="h-2 w-2 rounded-full bg-signal-green animate-blink" />
          {t.live}
        </span>
        <span className="font-mono text-xs text-ink-700">{t.ticker.empty}</span>
      </div>
    )
  }

  const items = [...log, ...log]

  return (
    <div className="flex items-center gap-3 overflow-hidden border-b border-base-700 bg-base-900 px-4 py-2">
      <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-500">
        <span className="h-2 w-2 rounded-full bg-signal-green animate-blink" />
        {t.live}
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-ticker gap-10 whitespace-nowrap">
          {items.map((entry, i) => (
            <span key={i} className="flex items-center gap-2 font-mono text-xs text-ink-500">
              <span className={`h-1.5 w-1.5 rounded-full ${dotColor[entry.level]}`} />
              <span className="text-ink-700">{entry.time}</span>
              <span className="text-ink-300">{entry.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
