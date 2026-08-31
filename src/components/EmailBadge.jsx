import { useAuth } from '../context/AuthContext'

export default function EmailBadge() {
  const { user, signOut } = useAuth()
  if (!user) return null

  return (
    <button
      onClick={signOut}
      title="Sign out"
      dir="ltr"
      className="flex items-center gap-2 rounded-full border border-base-700 bg-base-850 px-3 py-1.5 font-mono text-xs text-ink-300 transition-colors hover:border-signal-red hover:text-signal-red"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
      {user.email}
    </button>
  )
}
