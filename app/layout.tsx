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
  title: 'TF1 Jobs - منصة التوظيف الرياضية الرائدة في السعودية',
  description: 'منصة التوظيف الرياضية المعتمدة رسمياً - سجل تجاري 7037626640. ابحث عن وظائف في القطاع الرياضي من أفضل الشركات والمؤسسات.',
  keywords: 'وظائف رياضية, توظيف السعودية, منصة وظائف, سجل تجاري 7037626640, وظائف أندية, توظيف رياضي',
  openGraph: {
    title: 'TF1 Jobs - منصة التوظيف الرياضية الرائدة في السعودية',
    description: 'منصة التوظيف الرياضية المعتمدة رسمياً - سجل تجاري 7037626640',
    url: 'https://www.tf1one.com',
    siteName: 'TF1 Jobs',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TF1 Jobs Logo',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TF1 Jobs - منصة التوظيف الرياضية الرائدة في السعودية',
    description: 'منصة التوظيف الرياضية المعتمدة رسمياً - سجل تجاري 7037626640',
    images: ['/logo.png'],
  },
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TF1 Jobs",
    "url": "https://www.tf1one.com",
    "logo": "https://www.tf1one.com/logo.png",
    "description": "منصة التوظيف الرياضية المعتمدة رسمياً",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SA",
      "addressLocality": "Riyadh",
      "addressRegion": "Riyadh"
    },
    "identifier": {
      "@type": "PropertyValue",
      "name": "Commercial Registration",
      "value": "7037626640"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966-50-123-4567",
      "contactType": "customer service",
      "email": "contact@tf1one.com"
    },
    "sameAs": [
      "https://www.facebook.com/",
      "https://twitter.com/",
      "https://www.instagram.com/",
      "https://www.linkedin.com/"
    ]
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
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
