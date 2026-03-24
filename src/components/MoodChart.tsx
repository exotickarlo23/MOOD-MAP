'use client'

import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { MOODS, type MoodType } from '@/lib/moods'
import type { MoodEntry } from '@/lib/supabase'

interface MoodChartProps {
  entries: MoodEntry[]
}

export default function MoodChart({ entries }: MoodChartProps) {
  const data = useMemo(() => {
    if (entries.length < 2) return null
    return [...entries]
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(-14)
      .map((entry) => ({
        date: new Date(entry.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        intensity: entry.intensity,
        mood: entry.mood,
        emoji: MOODS[entry.mood as MoodType]?.emoji || '😐',
        color: MOODS[entry.mood as MoodType]?.color || '#C0C0C0',
      }))
  }, [entries])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-48 bg-white/50 rounded-2xl border border-gray-100">
        <p className="text-gray-400 text-sm">Add at least 2 entries to see trends</p>
      </div>
    )
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Mood Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} width={25} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const d = payload[0].payload
              return (
                <div className="bg-white shadow-lg rounded-xl px-3 py-2 border border-gray-100">
                  <p className="text-sm font-medium">{d.emoji} {d.date}</p>
                  <p className="text-xs text-gray-500">Intensity: {d.intensity}/10</p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="intensity"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#colorIntensity)"
            dot={(props: Record<string, unknown>) => {
              const { cx, cy, payload } = props as { cx: number; cy: number; payload: { emoji: string } }
              return (
                <text key={`dot-${cx}`} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={14}>
                  {payload.emoji}
                </text>
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
