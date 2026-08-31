import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  contacts: [], // max 2: { id, name, phone, messageCount }
  active: false,
  endsAt: null, // timestamp
  simLog: [], // simulated message log entries
}

const studyGuardSlice = createSlice({
  name: 'studyGuard',
  initialState,
  reducers: {
    addContact: {
      reducer: (state, action) => {
        if (state.contacts.length >= 2) return
        state.contacts.push(action.payload)
      },
      prepare: (name, phone) => ({
        payload: { id: nanoid(), name, phone, messageCount: 0 },
      }),
    },
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter((c) => c.id !== action.payload)
    },
    startSession: (state, action) => {
      const hours = action.payload
      state.active = true
      state.endsAt = Date.now() + hours * 60 * 60 * 1000
      state.simLog = []
      state.contacts.forEach((c) => (c.messageCount = 0))
    },
    endSession: (state) => {
      state.active = false
      state.endsAt = null
    },
    simulateIncomingMessage: (state, action) => {
      const contact = state.contacts.find((c) => c.id === action.payload)
      if (!contact || !state.active) return
      contact.messageCount += 1
      state.simLog.unshift({
        id: nanoid(),
        from: contact.name,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        autoReply: contact.messageCount > 5,
      })
    },
  },
})

export const {
  addContact,
  removeContact,
  startSession,
  endSession,
  simulateIncomingMessage,
} = studyGuardSlice.actions
export default studyGuardSlice.reducer
