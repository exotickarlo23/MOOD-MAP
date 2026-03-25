import type { MoodType } from './moods'

const MOOD_MESSAGES: Record<MoodType, string[]> = {
  odlicno: [
    'Predivno! Čuvaj taj osjećaj! ✨',
    'Sjajno je vidjeti te sretnog/u! 🌟',
    'Tvoja energija danas blista! 💫',
    'Kakav prekrasan dan za tebe! 🌈',
    'Nastavi širiti tu pozitivu! 🌻',
    'To je taj duh! Uživaj u svakom trenutku! 🎉',
    'Tvoj osmijeh danas osvjetljava sve oko tebe! ☀️',
    'Prekrasno! Zaslužuješ ovakve dane! 💖',
  ],
  dobro: [
    'Lijep dan za lijep mood! 🌻',
    'Lijepo je čuti da si dobro! 😊',
    'Dobar dan zaslužuje biti zabilježen! 📝',
    'Svaki dobar dan je mali dar! 🎁',
    'Nastavi tako — dobar osjećaj je zarazan! 💛',
    'Tvoj dan ide u dobrom smjeru! 🌿',
    'Drago mi je da si tu i da dijeliš kako se osjećaš! 🤗',
    'Dobro je — i to je sasvim dovoljno! 🌼',
  ],
  okej: [
    'Svaki dan je važan, i ovaj! 🌿',
    'Ponekad je "okej" sasvim u redu! ☁️',
    'I mirni dani imaju svoju ljepotu! 🍃',
    'Hvala što si tu i bilježiš svoj dan! 📖',
    'Okej dani su temelj dobrih dana! 🌱',
    'Nema pritiska — samo budi tu! 🕊️',
    'Svaki dan ne mora biti savršen! 🫶',
    'Mirni dani su važni za ravnotežu! ⚖️',
  ],
  lose: [
    'Drago mi je što dijeliš kako se osjećaš 💜',
    'I loši dani prolaze 🌧️→☀️',
    'Hrabro je priznati kako se osjećaš! 💪',
    'Nije svaki dan lagan, ali ti si tu! 🌸',
    'Dopusti si da osjećaš — to je dio procesa! 🫂',
    'Sutra je novi dan, pun novih mogućnosti! 🌅',
    'Tvoji osjećaji su važni i valjani! 💜',
    'Budi nježan/a prema sebi danas! 🤍',
  ],
  uzasno: [
    'Udahni duboko. Tu sam. 💛',
    'Budi nježan/a prema sebi danas 🫂',
    'Čak i u najtežim trenucima, nisi sam/a! 🤝',
    'Jedan udah po udah. Polako. 🌬️',
    'Hvala ti na iskrenosti — to zahtijeva hrabrost! 🦋',
    'Ovo će proći. Drži se! 🌤️',
    'Dopusti si da odmoriš — zaslužuješ to! 🛋️',
    'Pisanje o tome je prvi korak naprijed! ✍️',
  ],
}

const STORAGE_KEY = 'moodmap_last_buddy_msg'

export function getMoodBuddyMessage(mood: MoodType): string {
  const messages = MOOD_MESSAGES[mood]

  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const lastIndex = stored[mood] as number | undefined

      // Pick a random message, avoiding the last one shown for this mood
      let available = messages.map((_, i) => i)
      if (lastIndex !== undefined) {
        available = available.filter((i) => i !== lastIndex)
      }
      const picked = available[Math.floor(Math.random() * available.length)]

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...stored, [mood]: picked })
      )

      return messages[picked]
    } catch {
      // fallback
    }
  }

  return messages[0]
}
