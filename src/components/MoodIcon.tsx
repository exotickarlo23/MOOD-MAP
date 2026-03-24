import type { MoodType } from '@/lib/moods'

interface MoodIconProps {
  mood: MoodType
  size?: number
}

function OdlicnoIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sparkles */}
      <path d="M18 20L20 14L22 20L28 22L22 24L20 30L18 24L12 22L18 20Z" fill="#F9A8D4" opacity="0.7" />
      <path d="M78 15L79.5 10L81 15L86 16.5L81 18L79.5 23L78 18L73 16.5L78 15Z" fill="#F9A8D4" opacity="0.5" />
      <path d="M12 55L13.5 51L15 55L19 56.5L15 58L13.5 62L12 58L8 56.5L12 55Z" fill="#F9A8D4" opacity="0.6" />
      {/* Heart glow */}
      <ellipse cx="50" cy="55" rx="34" ry="30" fill="#FBB6CE" opacity="0.3" />
      {/* Heart shape */}
      <path d="M50 85C50 85 15 65 15 42C15 28 25 20 35 20C42 20 47 24 50 30C53 24 58 20 65 20C75 20 85 28 85 42C85 65 50 85 50 85Z" fill="url(#heart-gradient)" />
      {/* Heart highlight */}
      <path d="M35 28C30 28 23 33 23 42C23 45 24 48 26 51" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {/* Face - closed happy eyes */}
      <path d="M38 48C38 48 40 44 44 48" stroke="#D14D72" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M56 48C56 48 58 44 62 48" stroke="#D14D72" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M40 58C40 58 45 64 50 64C55 64 60 58 60 58" stroke="#D14D72" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="heart-gradient" x1="50" y1="20" x2="50" y2="85">
          <stop stopColor="#FDA4AF" />
          <stop offset="1" stopColor="#F472B6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function DobroIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle body */}
      <circle cx="50" cy="50" r="38" fill="url(#dobro-gradient)" />
      {/* Highlight */}
      <ellipse cx="38" cy="35" rx="14" ry="10" fill="white" opacity="0.2" />
      {/* Eyes */}
      <circle cx="38" cy="45" r="3" fill="#5C4033" />
      <circle cx="62" cy="45" r="3" fill="#5C4033" />
      {/* Eye shine */}
      <circle cx="39" cy="44" r="1" fill="white" />
      <circle cx="63" cy="44" r="1" fill="white" />
      {/* Blush */}
      <ellipse cx="30" cy="55" rx="7" ry="4" fill="#F9A8D4" opacity="0.4" />
      <ellipse cx="70" cy="55" rx="7" ry="4" fill="#F9A8D4" opacity="0.4" />
      {/* Smile */}
      <path d="M38 58C38 58 44 66 50 66C56 66 62 58 62 58" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="dobro-gradient" x1="50" y1="12" x2="50" y2="88">
          <stop stopColor="#FDCFAE" />
          <stop offset="1" stopColor="#F4A77A" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function OkejIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rounded rectangle body */}
      <rect x="16" y="16" width="68" height="68" rx="16" fill="url(#okej-gradient)" />
      {/* Highlight */}
      <rect x="22" y="22" width="24" height="16" rx="8" fill="white" opacity="0.15" />
      {/* Eyes - round with whites */}
      <ellipse cx="38" cy="45" rx="7" ry="8" fill="white" />
      <ellipse cx="62" cy="45" rx="7" ry="8" fill="white" />
      <circle cx="39" cy="46" r="4" fill="#374151" />
      <circle cx="63" cy="46" r="4" fill="#374151" />
      <circle cx="40" cy="44.5" r="1.5" fill="white" />
      <circle cx="64" cy="44.5" r="1.5" fill="white" />
      {/* Neutral mouth */}
      <line x1="40" y1="64" x2="60" y2="64" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="okej-gradient" x1="50" y1="16" x2="50" y2="84">
          <stop stopColor="#B0BEC5" />
          <stop offset="1" stopColor="#8494A7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function LoseIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Teardrop body */}
      <path d="M50 12C50 12 20 50 20 65C20 82 33 92 50 92C67 92 80 82 80 65C80 50 50 12 50 12Z" fill="url(#lose-gradient)" />
      {/* Highlight */}
      <path d="M38 40C38 40 34 52 32 60" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      {/* Eyes - sad */}
      <circle cx="40" cy="60" r="3" fill="#4C1D95" />
      <circle cx="60" cy="60" r="3" fill="#4C1D95" />
      <circle cx="41" cy="59" r="1" fill="white" />
      <circle cx="61" cy="59" r="1" fill="white" />
      {/* Sad eyebrows */}
      <path d="M34 54C34 54 37 51 43 53" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M66 54C66 54 63 51 57 53" stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Sad mouth */}
      <path d="M42 74C42 74 46 70 50 70C54 70 58 74 58 74" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="lose-gradient" x1="50" y1="12" x2="50" y2="92">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function UzasnoIcon({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blob body */}
      <path d="M50 8C65 8 78 12 84 22C92 35 90 48 86 60C82 72 74 82 62 88C55 91 45 91 38 88C26 82 18 72 14 60C10 48 8 35 16 22C22 12 35 8 50 8Z" fill="url(#uzasno-gradient)" />
      {/* Drip effect */}
      <path d="M70 82C70 82 72 90 70 95C68 98 66 95 66 92C66 89 68 84 70 82Z" fill="#E2C97E" opacity="0.6" />
      {/* Eyes - big and watery */}
      <ellipse cx="38" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="62" cy="48" rx="8" ry="9" fill="white" />
      <circle cx="38" cy="50" r="5" fill="#4A3728" />
      <circle cx="62" cy="50" r="5" fill="#4A3728" />
      <circle cx="40" cy="47" r="2" fill="white" />
      <circle cx="64" cy="47" r="2" fill="white" />
      {/* Tear */}
      <path d="M72 52C72 52 75 58 74 62C73 65 71 63 71 60C71 57 72 53 72 52Z" fill="#93C5FD" opacity="0.7" />
      {/* Open crying mouth */}
      <ellipse cx="50" cy="70" rx="10" ry="7" fill="#8B6914" />
      <ellipse cx="50" cy="68" rx="8" ry="3" fill="#4A3728" opacity="0.3" />
      <defs>
        <linearGradient id="uzasno-gradient" x1="50" y1="8" x2="50" y2="92">
          <stop stopColor="#F5E6B8" />
          <stop offset="1" stopColor="#E2C97E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const MOOD_ICONS: Record<MoodType, React.FC<{ size?: number }>> = {
  odlicno: OdlicnoIcon,
  dobro: DobroIcon,
  okej: OkejIcon,
  lose: LoseIcon,
  uzasno: UzasnoIcon,
}

export default function MoodIcon({ mood, size = 64 }: MoodIconProps) {
  const Icon = MOOD_ICONS[mood]
  if (!Icon) return null
  return <Icon size={size} />
}
