import { createSlice, nanoid } from '@reduxjs/toolkit'
import { getTodayKey } from '../../lib/date'

const initialState = {
  notes: [],
  notesLoaded: false,
  tasks: [],
  weeklyActivity: [
    { day: 'sat', focusHours: 0, notesDone: 0 },
    { day: 'sun', focusHours: 0, notesDone: 0 },
    { day: 'mon', focusHours: 0, notesDone: 0 },
    { day: 'tue', focusHours: 0, notesDone: 0 },
    { day: 'wed', focusHours: 0, notesDone: 0 },
    { day: 'thu', focusHours: 0, notesDone: 0 },
    { day: 'fri', focusHours: 0, notesDone: 0 },
  ],
  log: [],
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload
      state.notesLoaded = true
    },
    addNote: {
      reducer: (state, action) => {
        state.notes.push(action.payload)
      },
      prepare: (text, id) => ({
        payload: { id: id || nanoid(), text, done: false, createdAt: Date.now() },
      }),
    },
    toggleNote: (state, action) => {
      const note = state.notes.find((n) => n.id === action.payload)
      if (note) {
        note.done = !note.done
        const todayKey = getTodayKey()
        const entry = state.weeklyActivity.find((d) => d.day === todayKey)
        if (entry) {
          entry.notesDone = Math.max(0, entry.notesDone + (note.done ? 1 : -1))
        }
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((n) => n.id !== action.payload)
    },
    addTask: {
      reducer: (state, action) => {
        state.tasks.push(action.payload)
      },
      prepare: (label) => ({
        payload: { id: nanoid(), label, done: false, createdAt: Date.now() },
      }),
    },
    toggleTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) task.done = !task.done
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    logFocusSession: (state, action) => {
      const minutes = action.payload
      const todayKey = getTodayKey()
      const entry = state.weeklyActivity.find((d) => d.day === todayKey)
      if (entry) {
        entry.focusHours = Math.round((entry.focusHours + minutes / 60) * 10) / 10
      }
      state.log.unshift({
        id: nanoid(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        text: `Focus session logged: +${minutes} min`,
        level: 'green',
      })
    },
  },
})

export const {
  setNotes,
  addNote,
  toggleNote,
  deleteNote,
  addTask,
  toggleTask,
  deleteTask,
  logFocusSession,
} = dashboardSlice.actions
export default dashboardSlice.reducer
