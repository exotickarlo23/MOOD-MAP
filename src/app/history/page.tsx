import { getAllEntries } from '@/lib/queries'
import EntryCard from '@/components/EntryCard'
import LazyMoodChart from '@/components/LazyMoodChart'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const entries = await getAllEntries(50)

  return (
    <div className="max-w-md mx-auto px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center">Izvještaj</h1>

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white/30 rounded-2xl">
          <span className="text-4xl block mb-3">&#x1F4CA;</span>
          <p className="text-gray-500">Još nema unosa. Započni praćenje!</p>
        </div>
      ) : (
        <div className="space-y-4">
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
