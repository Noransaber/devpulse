import { withSentryConfig } from '@sentry/nextjs'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@devpulse/ui', '@devpulse/utils'],
}

export default withSentryConfig(withPWA(config), {
  silent: true,
})
