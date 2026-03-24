import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntryById } from '@/lib/queries'
import { MOODS, type MoodType, normalizeMood } from '@/lib/moods'
import MoodBadge from '@/components/MoodBadge'
import DeleteEntryButton from '@/components/DeleteEntryButton'

export const dynamic = 'force-dynamic'

export default async function EntryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = await getEntryById(id)

  if (!entry) {
    notFound()
  }

  const moodKey = normalizeMood(entry.mood)
  const mood = MOODS[moodKey]
  const date = new Date(entry.created_at)

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Link href="/history" className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
        &#x2190; Natrag
      </Link>

      <div className={`bg-gradient-to-br ${mood?.gradient || 'from-gray-200 to-gray-100'} rounded-3xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <MoodBadge mood={entry.mood} size="lg" />
          <div className="text-right">
            <p className="text-sm text-gray-600 font-medium">
              {date.toLocaleDateString('hr', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs text-gray-500">
              {date.toLocaleTimeString('hr', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {entry.story && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 mt-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Priča</h3>
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
