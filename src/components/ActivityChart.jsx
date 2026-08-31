import { useSelector } from 'react-redux'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function ActivityChart() {
  const data = useSelector((state) => state.dashboard.weeklyActivity)
  const { t } = useLanguage()
  const { colors } = useTheme()

  const chartData = data.map((d, i) => ({
    ...d,
    label: t.days[d.day],
    trendUp: i === 0 || d.focusHours >= data[i - 1].focusHours,
  }))

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">
          {t.charts.weeklyFocus}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          {t.charts.last7days}
        </span>
      </div>
      <div className="mb-3 flex flex-col gap-0.5">
        <p className="font-mono text-[10px] text-signal-green">🟢 {t.charts.legendGood}</p>
        <p className="font-mono text-[10px] text-signal-red">🔴 {t.charts.legendBad}</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="label"
            stroke={colors.axis}
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
          />
          <YAxis
            stroke={colors.axis}
            tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 8,
              fontFamily: 'Inter',
              fontSize: 12,
            }}
            cursor={{ fill: colors.cursor }}
            labelStyle={{ color: colors.tooltipText }}
          />
          <Bar dataKey="focusHours" name={t.stats.focusHours} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.trendUp ? colors.green : colors.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
