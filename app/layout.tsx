import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { MSWProvider } from './mocks'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { ScrollToTop } from '@/components/scroll-to-top'

export const metadata: Metadata = {
  title: ' TF1 JOPS ',
  description: 'منصة تربط الباحثين عن وظائف رياضية بالأندية والجهات في المملكة',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
            <ScrollToTop />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
