'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteEntry } from '@/lib/moodStorage'

export default function DeleteEntryButton({ entryId }: { entryId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  function handleDelete() {
    if (!confirm('Jesi li siguran/a da želiš obrisati ovaj unos?')) return
    setDeleting(true)
    deleteEntry(entryId)
    router.push('/history')
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-400 hover:text-red-600 transition-colors px-4 py-2 rounded-xl hover:bg-red-50"
    >
      {deleting ? 'Deleting...' : 'Delete entry'}
    </button>
  )
}
