'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  // 'dark' is the safe SSR default — the anti-flash script in layout.tsx
  // handles the initial class before React mounts, so no visible flash occurs.
  const [theme, setTheme] = useState<Theme>('dark')

  // Read the real preference once the component mounts (client-only).
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
      return
    }
    setTheme(
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    )
  }, [])

  // Apply the class and persist whenever theme changes.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return {
    theme,
    toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  }
}
