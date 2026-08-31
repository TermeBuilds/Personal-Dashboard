import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addContact,
  removeContact,
  startSession,
  endSession,
  simulateIncomingMessage,
} from '../features/studyGuard/studyGuardSlice'
import { useLanguage } from '../context/LanguageContext'

export default function StudyGuard() {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const { contacts, active, endsAt, simLog } = useSelector((s) => s.studyGuard)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [hours, setHours] = useState(2)
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    if (!active || !endsAt) return
    const interval = setInterval(() => {
      const diff = endsAt - Date.now()
      if (diff <= 0) {
        dispatch(endSession())
        setRemaining('')
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining(`${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [active, endsAt, dispatch])

  const handleAddContact = () => {
    if (!name.trim() || !phone.trim() || contacts.length >= 2) return
    dispatch(addContact(name.trim(), phone.trim()))
    setName('')
    setPhone('')
  }

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">{t.studyGuard.title}</h3>
        {active && (
          <span className="rounded-full bg-signal-amber/10 px-2 py-0.5 font-mono text-[10px] text-signal-amber">
            {t.studyGuard.active}
          </span>
        )}
      </div>

      {!active ? (
        <>
          <div className="mb-3 flex flex-col gap-2">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-md border border-base-700 bg-base-900 px-3 py-2"
              >
                <span className="font-body text-sm text-ink-300">
                  {c.name} · <span dir="ltr">{c.phone}</span>
                </span>
                <button
                  onClick={() => dispatch(removeContact(c.id))}
                  className="text-ink-700 hover:text-signal-red"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {contacts.length < 2 && (
            <div className="mb-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.studyGuard.namePlaceholder}
                className="flex-1 rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-sm text-ink-100 outline-none focus:border-signal-green"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.studyGuard.phonePlaceholder}
                dir="ltr"
                className="flex-1 rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-sm text-ink-100 outline-none focus:border-signal-green"
              />
              <button
                onClick={handleAddContact}
                className="rounded-md bg-signal-green px-4 py-2 font-body text-sm font-medium text-base-950 hover:opacity-90"
              >
                {t.notes.add}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-sm text-ink-100 outline-none focus:border-signal-green"
            >
              {[1, 2, 3, 6].map((h) => (
                <option key={h} value={h}>
                  {h} {t.studyGuard.hours}
                </option>
              ))}
            </select>
            <button
              onClick={() => dispatch(startSession(hours))}
              disabled={contacts.length === 0}
              className="flex-1 rounded-md bg-signal-green py-2 font-body text-sm font-medium text-base-950 hover:opacity-90 disabled:opacity-40"
            >
              {t.studyGuard.start}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex flex-col items-center rounded-md border border-signal-amber/30 bg-signal-amber/5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
              {t.studyGuard.timeLeft}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-signal-amber">
              {remaining}
            </p>
            <button
              onClick={() => dispatch(endSession())}
              className="mt-3 rounded-md border border-base-700 px-4 py-1.5 font-body text-xs text-ink-300 hover:border-base-600"
            >
              {t.studyGuard.end}
            </button>
          </div>

          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-ink-500">
            {t.studyGuard.simulateHint}
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            {contacts.map((c) => (
              <button
                key={c.id}
                onClick={() => dispatch(simulateIncomingMessage(c.id))}
                className="rounded-full border border-base-700 px-3 py-1.5 font-body text-xs text-ink-300 hover:border-signal-green hover:text-signal-green"
              >
                {t.studyGuard.simulateFrom} {c.name} ({c.messageCount})
              </button>
            ))}
          </div>

          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto">
            {simLog.length === 0 && (
              <p className="font-body text-xs text-ink-700">{t.studyGuard.noMessages}</p>
            )}
            {simLog.map((entry) => (
              <div
                key={entry.id}
                className="rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-xs"
              >
                <span className="text-ink-500">{entry.time} — </span>
                <span className="text-ink-300">
                  {entry.from} {t.studyGuard.sentMessage}
                </span>
                {entry.autoReply && (
                  <p className="mt-1 text-signal-green">↳ {t.studyGuard.autoReplyText}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
