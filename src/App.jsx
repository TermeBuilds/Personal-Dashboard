import { useState } from 'react'
import { useSelector } from 'react-redux'
import Sidebar from './components/Sidebar'
import StatusTicker from './components/StatusTicker'
import Header from './components/Header'
import StatCard from './components/StatCard'
import NotesList from './components/NotesList'
import TaskList from './components/TaskList'
import ActivityChart from './components/ActivityChart'
import HabitBarChart from './components/HabitBarChart'
import PomodoroTimer from './components/PomodoroTimer'
import AIChat from './components/AIChat'
import StudyGuard from './components/StudyGuard'
import { useLanguage } from './context/LanguageContext'

export default function App() {
  const [view, setView] = useState('dashboard')
  const { notes, tasks, weeklyActivity } = useSelector((state) => state.dashboard)
  const studyGuardActive = useSelector((state) => state.studyGuard.active)
  const { t } = useLanguage()

  const totalFocusHours = weeklyActivity
    .reduce((sum, d) => sum + d.focusHours, 0)
    .toFixed(1)
  const doneNotes = notes.filter((n) => n.done).length
  const doneTasks = tasks.filter((task) => task.done).length

  const statCards = (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        index={0}
        label={t.stats.focusHours}
        value={totalFocusHours}
        unit={t.stats.hours}
        delta="↑"
        deltaLevel="green"
      />
      <StatCard
        index={1}
        label={t.stats.notesDone}
        value={notes.length ? `${doneNotes}/${notes.length}` : '0/0'}
        delta={notes.length && doneNotes === notes.length ? t.stats.complete : t.stats.inProgress}
        deltaLevel={notes.length && doneNotes === notes.length ? 'green' : 'amber'}
      />
      <StatCard
        index={2}
        label={t.stats.tasksDone}
        value={tasks.length ? `${doneTasks}/${tasks.length}` : '0/0'}
        delta={tasks.length ? `${tasks.length - doneTasks} ${t.stats.remaining}` : '—'}
        deltaLevel="amber"
      />
      <StatCard
        index={3}
        label={t.stats.totalNotes}
        value={notes.length}
        unit={t.stats.items}
        delta="—"
        deltaLevel="green"
      />
    </div>
  )

  const lockOverlay = studyGuardActive && (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-base-950/85 backdrop-blur-sm">
      <div className="text-center">
        <p className="font-display text-lg font-semibold text-signal-amber">
          🔒 {t.studyGuard.lockedTitle}
        </p>
        <p className="mt-1 font-body text-xs text-ink-500">{t.studyGuard.lockedDesc}</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-base-950 font-body">
      <Sidebar view={view} onChangeView={setView} />

      <div className="flex-1">
        <StatusTicker />
        <Header />

        <main className="bg-grid bg-grid px-6 pb-10">
          {view === 'dashboard' && (
            <>
              {statCards}

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ActivityChart />
                <HabitBarChart />
              </div>

              <div className="relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <NotesList />
                <TaskList />
                {lockOverlay}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <PomodoroTimer />
                <StudyGuard />
              </div>

              <div className="mt-4">
                <AIChat />
              </div>
            </>
          )}

          {view === 'notes' && (
            <div className="relative mt-2 max-w-2xl">
              <NotesList />
              {lockOverlay}
            </div>
          )}

          {view === 'tasks' && (
            <div className="relative mt-2 max-w-2xl">
              <TaskList />
              {lockOverlay}
            </div>
          )}

          {view === 'reports' && (
            <div className="mt-2">
              {statCards}
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ActivityChart />
                <HabitBarChart />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
