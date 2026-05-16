import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryProvider } from '@/lib/query/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevPulse',
  description: 'Real-time engineering team dashboard',
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
