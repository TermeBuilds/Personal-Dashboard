import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { logFocusSession } from '../features/dashboard/dashboardSlice'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function PomodoroTimer() {
  const { t } = useLanguage()
  const { colors } = useTheme()
  const dispatch = useDispatch()

  const [focusMinutes, setFocusMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const intervalRef = useRef(null)

  const focusSeconds = focusMinutes * 60
  const breakSeconds = breakMinutes * 60

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const handleSessionEnd = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    if (mode === 'focus') {
      dispatch(logFocusSession(focusMinutes))
      setMode('break')
      setSecondsLeft(breakSeconds)
    } else {
      setMode('focus')
      setSecondsLeft(focusSeconds)
    }
  }

  const toggle = () => {
    if (!running && secondsLeft === 0) {
      setSecondsLeft(mode === 'focus' ? focusSeconds : breakSeconds)
    }
    setRunning((r) => !r)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode('focus')
    setSecondsLeft(focusSeconds)
  }

  const stopEarlyAndLogPartial = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    if (mode === 'focus') {
      const elapsedMinutes = Math.round((focusSeconds - secondsLeft) / 60)
      if (elapsedMinutes > 0) dispatch(logFocusSession(elapsedMinutes))
    }
    setMode('focus')
    setSecondsLeft(focusSeconds)
  }

  const handleFocusMinutesChange = (value) => {
    const v = Math.max(1, Math.min(180, Number(value) || 1))
    setFocusMinutes(v)
    if (!running && mode === 'focus') setSecondsLeft(v * 60)
  }

  const handleBreakMinutesChange = (value) => {
    const v = Math.max(1, Math.min(60, Number(value) || 1))
    setBreakMinutes(v)
    if (!running && mode === 'break') setSecondsLeft(v * 60)
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const total = mode === 'focus' ? focusSeconds : breakSeconds
  const progress = total > 0 ? ((total - secondsLeft) / total) * 100 : 0

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">
          {t.pomodoro.title}
        </h3>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
            mode === 'focus'
              ? 'bg-signal-green/10 text-signal-green'
              : 'bg-signal-amber/10 text-signal-amber'
          }`}
        >
          {mode === 'focus' ? t.pomodoro.focusMode : t.pomodoro.breakMode}
        </span>
      </div>

      {!running && (
        <div className="mb-4 flex items-center justify-center gap-4">
          <label className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
              {t.pomodoro.focusMode}
            </span>
            <input
              type="number"
              min={1}
              max={180}
              value={focusMinutes}
              onChange={(e) => handleFocusMinutesChange(e.target.value)}
              className="w-16 rounded-md border border-base-700 bg-base-900 px-2 py-1 text-center font-mono text-sm text-ink-100 outline-none focus:border-signal-green"
            />
          </label>
          <label className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
              {t.pomodoro.breakMode}
            </span>
            <input
              type="number"
              min={1}
              max={60}
              value={breakMinutes}
              onChange={(e) => handleBreakMinutesChange(e.target.value)}
              className="w-16 rounded-md border border-base-700 bg-base-900 px-2 py-1 text-center font-mono text-sm text-ink-100 outline-none focus:border-signal-green"
            />
          </label>
        </div>
      )}

      <div className="flex flex-col items-center py-2">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90">
            <circle cx="64" cy="64" r="56" stroke={colors.track} strokeWidth="8" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={mode === 'focus' ? colors.green : colors.amber}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="font-mono text-2xl font-semibold text-ink-100">
            {minutes}:{seconds}
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={toggle}
            className="rounded-md bg-signal-green px-5 py-2 font-body text-sm font-medium text-base-950 transition-opacity hover:opacity-90"
          >
            {running ? t.pomodoro.pause : t.pomodoro.start}
          </button>
          <button
            onClick={mode === 'focus' && secondsLeft < focusSeconds ? stopEarlyAndLogPartial : reset}
            className="rounded-md border border-base-700 px-5 py-2 font-body text-sm text-ink-300 transition-colors hover:border-base-600"
          >
            {t.pomodoro.reset}
          </button>
        </div>
        <p className="mt-3 font-mono text-[10px] text-ink-500">{t.pomodoro.hint}</p>
      </div>
    </div>
  )
}
