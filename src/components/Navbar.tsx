'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/new', label: 'New Entry', icon: '✍️' },
  { href: '/history', label: 'History', icon: '📊' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hidden md:block text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            SMOOD STORY
          </Link>
          <div className="flex items-center justify-around w-full md:w-auto md:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col md:flex-row items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-purple-600 bg-purple-50 font-semibold'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
