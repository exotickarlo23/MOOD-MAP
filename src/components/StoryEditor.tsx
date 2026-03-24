'use client'

const PROMPTS = [
  "What's on your mind today?",
  "Tell your story...",
  "How did your day go?",
  "What made you feel this way?",
  "Write about this moment...",
]

interface StoryEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function StoryEditor({ value, onChange }: StoryEditorProps) {
  const placeholder = PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length]

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Your Story</h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full p-4 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all"
      />
      <p className="text-xs text-gray-400 mt-1 text-right">{value.length} characters</p>
    </div>
  )
}
