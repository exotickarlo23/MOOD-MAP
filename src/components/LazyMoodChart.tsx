'use client'

import dynamic from 'next/dynamic'
import type { MoodEntry } from '@/lib/supabase'

const MoodChart = dynamic(() => import('@/components/MoodChart'), {
  loading: () => <div className="h-52 bg-white/50 rounded-2xl animate-pulse" />,
  ssr: false,
})

export default function LazyMoodChart({ entries }: { entries: MoodEntry[] }) {
  return <MoodChart entries={entries} />
}
