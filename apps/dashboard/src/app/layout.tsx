import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryProvider } from '@/lib/query/provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DevPulse',
    template: '%s | DevPulse',
  },
  description: 'Real-time engineering team dashboard — Kanban board, GitHub metrics, team presence, and AI standups.',
  keywords: ['dashboard', 'engineering', 'kanban', 'real-time', 'Next.js'],
  authors: [{ name: 'Noran Abdelfattah' }],
  creator: 'Noran Abdelfattah',
  metadataBase: new URL('https://devpulse-dashboard-zeta.vercel.app'),
  openGraph: {
    title: 'DevPulse',
    description: 'Real-time engineering team dashboard',
    url: 'https://devpulse-dashboard-zeta.vercel.app',
    siteName: 'DevPulse',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'DevPulse',
    description: 'Real-time engineering team dashboard',
    creator: '@noransaber685',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
}

// Runs synchronously before React hydration to set the correct theme class,
// preventing a flash of the wrong theme on page load.
const themeScript = `(function(){
  try {
    var s = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (!s && d)) document.documentElement.classList.add('dark');
  } catch(e) {}
})()`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning: the anti-flash script mutates className before
          React hydrates, so the server/client HTML won't match — this is expected. */}
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        </head>
        <body>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
