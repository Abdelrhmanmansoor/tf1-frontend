import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { MSWProvider } from './mocks'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import { SocketProvider } from '@/contexts/socket-context'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: ' TF1 JOPS ',
  description: 'منصة تربط الباحثين عن وظائف رياضية بالأندية والجهات في المملكة',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
            <SocketProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
              <ScrollToTop />
              <Toaster richColors position="top-center" />
            </SocketProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
