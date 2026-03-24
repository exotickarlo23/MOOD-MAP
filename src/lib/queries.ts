import { supabase, type MoodEntry } from './supabase'

export async function getRecentEntries(limit = 3): Promise<MoodEntry[]> {
  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function getAllEntries(limit = 50): Promise<MoodEntry[]> {
  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

export async function getEntryById(id: string): Promise<MoodEntry | null> {
  const { data } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('id', id)
    .single()
  return data
}
