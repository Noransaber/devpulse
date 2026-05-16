import { SignIn } from '@clerk/nextjs'

const appearance = {
  variables: {
    colorPrimary: '#4f46e5',
    colorBackground: '#111827',
    colorInputBackground: '#1f2937',
    colorText: '#f9fafb',
    colorTextSecondary: '#9ca3af',
    colorInputText: '#f9fafb',
    colorDanger: '#ef4444',
    colorNeutral: '#ffffff',
    borderRadius: '0.5rem',
    fontFamily: 'inherit',
  },
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 py-12 dark:bg-gray-950">
      <SignIn appearance={appearance} />
    </main>
  )
}
