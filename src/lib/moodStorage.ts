export type MoodEntry = {
  id: string
  mood: string
  intensity: number
  story: string | null
  created_at: string
}

const STORAGE_KEY = 'moodmap_entries'

function readEntries(): MoodEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeEntries(entries: MoodEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // QuotaExceededError - silently fail
  }
}

export function getAllEntries(limit = 50): MoodEntry[] {
  const entries = readEntries()
  entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return entries.slice(0, limit)
}

export function getRecentEntries(limit = 3): MoodEntry[] {
  return getAllEntries(limit)
}

export function getEntryById(id: string): MoodEntry | null {
  const entries = readEntries()
  return entries.find((e) => e.id === id) || null
}

export function addEntry(data: Omit<MoodEntry, 'id' | 'created_at'>): MoodEntry {
  const entries = readEntries()
  const newEntry: MoodEntry = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }
  entries.push(newEntry)
  writeEntries(entries)
  return newEntry
}

export function updateEntry(
  id: string,
  data: Partial<Omit<MoodEntry, 'id' | 'created_at'>>
): MoodEntry | null {
  const entries = readEntries()
  const index = entries.findIndex((e) => e.id === id)
  if (index === -1) return null
  entries[index] = { ...entries[index], ...data }
  writeEntries(entries)
  return entries[index]
}

export function deleteEntry(id: string): boolean {
  const entries = readEntries()
  const filtered = entries.filter((e) => e.id !== id)
  if (filtered.length === entries.length) return false
  writeEntries(filtered)
  return true
}
