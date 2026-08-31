const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

// Returns one of: sat, sun, mon, tue, wed, thu, fri
export function getTodayKey() {
  return DAY_KEYS[new Date().getDay()]
}
