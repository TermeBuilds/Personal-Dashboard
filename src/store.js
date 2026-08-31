import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './features/dashboard/dashboardSlice'
import studyGuardReducer from './features/studyGuard/studyGuardSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    studyGuard: studyGuardReducer,
  },
})
