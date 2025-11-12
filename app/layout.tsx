import type { Metadata } from 'next'
import '@/styles/globals.css'
import { MSWProvider } from './mocks'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'

export const metadata: Metadata = {
  title: 'SportX - Sports Platform',
  description: 'Connect players, coaches, clubs, and specialists',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans">
        {/* <MSWProvider /> */}
        <LanguageProvider>
          <AuthProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
