'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DeleteEntryButton({ entryId }: { entryId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this entry?')) return
    setDeleting(true)
    await supabase.from('mood_entries').delete().eq('id', entryId)
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
