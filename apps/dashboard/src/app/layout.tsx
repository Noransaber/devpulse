import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactQueryProvider } from '@/lib/query/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevPulse',
  description: 'Real-time engineering team dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
