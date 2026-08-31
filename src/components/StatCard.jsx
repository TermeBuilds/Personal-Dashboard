export default function StatCard({ label, value, unit, delta, deltaLevel = 'green', index = 0 }) {
  const deltaColor = {
    green: 'text-signal-green',
    red: 'text-signal-red',
    amber: 'text-signal-amber',
  }[deltaLevel]

  return (
    <div
      className="animate-rise rounded-lg border border-base-700 bg-base-850 p-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl font-semibold text-ink-100">{value}</span>
        {unit && <span className="font-body text-sm text-ink-500">{unit}</span>}
      </div>
      {delta && (
        <p className={`mt-1 font-mono text-xs ${deltaColor}`}>{delta}</p>
      )}
    </div>
  )
}
