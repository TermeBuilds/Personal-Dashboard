import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function AuthGate({ children }) {
  const { user, loading, signIn, signUp, isSupabaseConfigured } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null

  if (user) return children

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!email.trim()) return
    if (isSupabaseConfigured && password.length < 6) {
      setError(t.auth.passwordTooShort)
      return
    }
    setSubmitting(true)
    const action = mode === 'signin' ? signIn : signUp
    const { error: err } = await action(email.trim(), password)
    setSubmitting(false)
    if (err) {
      setError(err.message)
      return
    }
    if (isSupabaseConfigured && mode === 'signup') {
      setInfo(t.auth.checkEmailConfirm)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-4">
      <div className="w-full max-w-sm rounded-lg border border-base-700 bg-base-850 p-6">
        <div className="mb-5 flex items-center gap-2">
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

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-md border border-signal-amber/40 bg-signal-amber/10 px-3 py-2 font-mono text-[11px] text-signal-amber">
            {t.auth.localModeNotice}
          </p>
        )}

        <h2 className="font-display text-base font-semibold text-ink-100">
          {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            dir="ltr"
            required
            className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-left font-mono text-sm text-ink-100 outline-none focus:border-signal-green"
          />
          {isSupabaseConfigured && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.passwordPlaceholder}
              dir="ltr"
              required
              minLength={6}
              className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-left font-mono text-sm text-ink-100 outline-none focus:border-signal-green"
            />
          )}

          {error && <p className="font-body text-xs text-signal-red">{error}</p>}
          {info && <p className="font-body text-xs text-signal-green">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-md bg-signal-green py-2 font-body text-sm font-medium text-base-950 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting
              ? '...'
              : mode === 'signin'
              ? t.auth.signIn
              : t.auth.signUp}
          </button>
        </form>

        {isSupabaseConfigured && (
          <button
            onClick={() => {
              setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
              setError('')
              setInfo('')
            }}
            className="mt-4 w-full text-center font-body text-xs text-ink-500 hover:text-signal-green"
          >
            {mode === 'signin' ? t.auth.switchToSignUp : t.auth.switchToSignIn}
          </button>
        )}
      </div>
    </div>
  )
}
