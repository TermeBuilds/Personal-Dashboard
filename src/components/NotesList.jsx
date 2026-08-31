import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNote, deleteNote, toggleNote, setNotes } from '../features/dashboard/dashboardSlice'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { analyzeSentiment, sentimentMeta } from '../lib/sentiment'

export default function NotesList() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const notes = useSelector((state) => state.dashboard.notes)
  const notesLoaded = useSelector((state) => state.dashboard.notesLoaded)
  const dispatch = useDispatch()
  const [draft, setDraft] = useState('')

  // Load notes from Supabase on mount (real backend mode only)
  useEffect(() => {
    if (!isSupabaseConfigured || !user || notesLoaded) return
    supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          dispatch(
            setNotes(
              data.map((row) => ({
                id: row.id,
                text: row.text,
                done: row.done,
                createdAt: row.created_at,
              }))
            )
          )
        }
      })
  }, [user, notesLoaded, dispatch])

  const handleAdd = async () => {
    const value = draft.trim()
    if (!value) return

    if (isSupabaseConfigured && user) {
      const { data, error } = await supabase
        .from('notes')
        .insert({ text: value, done: false, user_id: user.id })
        .select()
        .single()
      if (!error && data) {
        dispatch(addNote(value, data.id))
      }
    } else {
      dispatch(addNote(value))
    }
    setDraft('')
  }

  const handleToggle = async (note) => {
    dispatch(toggleNote(note.id))
    if (isSupabaseConfigured && user) {
      await supabase.from('notes').update({ done: !note.done }).eq('id', note.id)
    }
  }

  const handleDelete = async (note) => {
    dispatch(deleteNote(note.id))
    if (isSupabaseConfigured && user) {
      await supabase.from('notes').delete().eq('id', note.id)
    }
  }

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">{t.notes.title}</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          {notes.filter((n) => n.done).length}/{notes.length}
        </span>
      </div>

      <div className="mb-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={t.notes.placeholder}
          className="flex-1 rounded-md border border-base-700 bg-base-900 px-3 py-2 font-body text-sm text-ink-100 outline-none focus:border-signal-green"
        />
        <button
          onClick={handleAdd}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-signal-green font-display text-lg font-bold text-base-950 transition-opacity hover:opacity-90"
          aria-label={t.notes.add}
        >
          +
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="rounded-md border border-dashed border-base-700 px-3 py-4 text-center font-body text-xs text-ink-500">
          {t.notes.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map((note) => {
            const sentiment = analyzeSentiment(note.text)
            const meta = sentimentMeta[sentiment]
            return (
              <div
                key={note.id}
                className={`flex items-center justify-between gap-3 rounded-md border bg-base-900 px-3 py-2 ${meta.borderClass}`}
              >
                <button
                  onClick={() => handleToggle(note)}
                  className="flex flex-1 items-center gap-3 text-right"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                      note.done
                        ? 'border-signal-green bg-signal-green/10 text-signal-green'
                        : 'border-base-600 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span
                    className={`font-body text-sm ${
                      note.done ? 'text-ink-700 line-through' : 'text-ink-300'
                    }`}
                  >
                    {note.text}
                  </span>
                </button>
                <span title={sentiment} className="shrink-0 text-sm">
                  {meta.emoji}
                </span>
                <button
                  onClick={() => handleDelete(note)}
                  className="shrink-0 text-ink-700 transition-colors hover:text-signal-red"
                  aria-label="delete"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
