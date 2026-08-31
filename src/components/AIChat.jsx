import { useState, useRef, useEffect } from 'react'
import { assistants, askAssistant } from '../lib/aiClient'
import { useLanguage } from '../context/LanguageContext'

export default function AIChat() {
  const { t, lang } = useLanguage()
  const [activeId, setActiveId] = useState('groq')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const active = assistants[activeId]

  const handleSend = async () => {
    const value = input.trim()
    if (!value || loading) return

    if (!active.configured) {
      setError(t.ai.notConfigured)
      return
    }

    const nextMessages = [...messages, { role: 'user', content: value }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const reply = await askAssistant(activeId, nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err.message === 'MISSING_KEY' ? t.ai.notConfigured : t.ai.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">{t.ai.title}</h3>
      </div>

      <div className="mb-3 flex gap-2">
        {Object.values(assistants).map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveId(a.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
              activeId === a.id
                ? 'border-signal-green bg-signal-green/10 text-signal-green'
                : 'border-base-700 text-ink-500 hover:border-base-600'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${a.configured ? 'bg-signal-green' : 'bg-ink-700'}`} />
            {lang === 'fa' ? a.label : a.labelEn}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="mb-3 flex h-56 flex-col gap-2 overflow-y-auto rounded-md border border-base-700 bg-base-900 p-3"
      >
        {messages.length === 0 && (
          <p className="m-auto font-body text-xs text-ink-700">{t.ai.emptyState}</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-md px-3 py-2 font-body text-sm ${
              m.role === 'user'
                ? 'self-end bg-signal-green/10 text-ink-100'
                : 'self-start bg-base-800 text-ink-300'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-md bg-base-800 px-3 py-2 font-mono text-xs text-ink-500">
            {t.ai.thinking}
          </div>
        )}
      </div>

      {error && <p className="mb-2 font-body text-xs text-signal-red">{error}</p>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.ai.placeholder}
          className="flex-1 rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-sm text-ink-100 outline-none focus:border-signal-green"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-md bg-signal-green px-4 py-2 font-body text-sm font-medium text-base-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {t.ai.send}
        </button>
      </div>
    </div>
  )
}
