'use client'

import { MOODS, MOOD_KEYS, type MoodType } from '@/lib/moods'

interface MoodSelectorProps {
  selected: MoodType | null
  onSelect: (mood: MoodType) => void
  intensity: number
  onIntensityChange: (intensity: number) => void
}

export default function MoodSelector({ selected, onSelect, intensity, onIntensityChange }: MoodSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">How are you feeling?</h2>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {MOOD_KEYS.map((key) => {
            const mood = MOODS[key]
            const isSelected = selected === key
            return (
              <button
                key={key}
                onClick={() => onSelect(key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? `bg-gradient-to-b ${mood.gradient} ring-2 ring-offset-2 scale-110 shadow-lg`
                    : 'bg-white hover:bg-gray-50 hover:scale-105 shadow-sm'
                }`}
                style={isSelected ? { '--tw-ring-color': mood.color } as React.CSSProperties : {}}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className={`text-xs font-medium ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                  {mood.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Intensity</h2>
            <span className="text-2xl font-bold" style={{ color: MOODS[selected].color }}>
              {intensity}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => onIntensityChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
            style={{ accentColor: MOODS[selected].color }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Mild</span>
            <span>Intense</span>
          </div>
        </div>
      )}
    </div>
  )
}
