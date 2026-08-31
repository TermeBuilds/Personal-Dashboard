import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, deleteTask, toggleTask } from '../features/dashboard/dashboardSlice'
import { useLanguage } from '../context/LanguageContext'

export default function TaskList() {
  const { t } = useLanguage()
  const tasks = useSelector((state) => state.dashboard.tasks)
  const dispatch = useDispatch()
  const [draft, setDraft] = useState('')

  const handleAdd = () => {
    const value = draft.trim()
    if (!value) return
    dispatch(addTask(value))
    setDraft('')
  }

  return (
    <div className="rounded-lg border border-base-700 bg-base-850 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink-100">{t.tasks.title}</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          {tasks.filter((task) => task.done).length}/{tasks.length}
        </span>
      </div>

      <div className="mb-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={t.tasks.placeholder}
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

      {tasks.length === 0 ? (
        <p className="rounded-md border border-dashed border-base-700 px-3 py-4 text-center font-body text-xs text-ink-500">
          {t.tasks.empty}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-md border border-base-700 bg-base-900 px-3 py-2"
            >
              <button
                onClick={() => dispatch(toggleTask(task.id))}
                className="flex flex-1 items-center gap-3 text-right"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                    task.done
                      ? 'border-signal-green bg-signal-green/10 text-signal-green'
                      : 'border-base-600 text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span
                  className={`font-body text-sm ${
                    task.done ? 'text-ink-700 line-through' : 'text-ink-300'
                  }`}
                >
                  {task.label}
                </span>
              </button>
              <button
                onClick={() => dispatch(deleteTask(task.id))}
                className="shrink-0 text-ink-700 transition-colors hover:text-signal-red"
                aria-label="delete"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
