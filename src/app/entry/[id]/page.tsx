import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntryById } from '@/lib/queries'
import { MOODS, type MoodType } from '@/lib/moods'
import MoodBadge from '@/components/MoodBadge'
import DeleteEntryButton from '@/components/DeleteEntryButton'

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = await getEntryById(id)

  if (!entry) {
    notFound()
  }

  const mood = MOODS[entry.mood as MoodType]
  const date = new Date(entry.created_at)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/history" className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        ← Back
      </Link>

      <div className={`bg-gradient-to-br ${mood?.gradient || 'from-gray-200 to-gray-100'} rounded-3xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <MoodBadge mood={entry.mood} size="lg" />
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">
              {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500">
              {date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Intensity</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < entry.intensity ? 'scale-100' : 'scale-75 opacity-20'
                  }`}
                  style={{ backgroundColor: mood?.color || '#ccc' }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-700">{entry.intensity}/10</span>
          </div>
        </div>

        {entry.story && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Story</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.story}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <DeleteEntryButton entryId={entry.id} />
        </div>
      </div>
    </div>
  )
}
