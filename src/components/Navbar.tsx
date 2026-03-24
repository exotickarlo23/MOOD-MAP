'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Danas', icon: 'home' },
  { href: '/calendar', label: 'Kalendar', icon: 'calendar' },
  { href: '/history', label: 'Izvještaj', icon: 'report' },
  { href: '/badges', label: 'Badges', icon: 'badges' },
]

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? '#6366F1' : '#9CA3AF'
  switch (type) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'calendar':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <rect x="7" y="13" width="3" height="3" rx="0.5" fill={color} stroke="none" />
          <rect x="14" y="13" width="3" height="3" rx="0.5" fill={color} stroke="none" opacity="0.4" />
        </svg>
      )
    case 'report':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <rect x="8" y="13" width="3" height="5" rx="0.5" fill={color} stroke="none" opacity="0.6" />
          <rect x="13" y="11" width="3" height="7" rx="0.5" fill={color} stroke="none" opacity="0.8" />
        </svg>
      )
    case 'badges':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
          <circle cx="12" cy="8" r="2.5" fill={color} stroke="none" opacity="0.3" />
        </svg>
      )
    default:
      return null
  }
}

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-indigo-500' : 'text-gray-400'
                }`}
              >
                <NavIcon type={item.icon} active={isActive} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
