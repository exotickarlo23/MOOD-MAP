import { getAllEntries } from '@/lib/queries'
import EntryCard from '@/components/EntryCard'
import LazyMoodChart from '@/components/LazyMoodChart'

export default async function HistoryPage() {
  const entries = await getAllEntries(50)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Mood History</h1>

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white/30 rounded-2xl">
          <span className="text-5xl block mb-3">📊</span>
          <p className="text-gray-500">No mood entries yet. Start tracking!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <LazyMoodChart entries={entries} />
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
