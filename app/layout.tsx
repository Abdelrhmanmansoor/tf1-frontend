import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'
import { MSWProvider } from './mocks'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import { SocketProvider } from '@/contexts/socket-context'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { ScrollToTop } from '@/components/scroll-to-top'
import { Toaster } from 'sonner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { GlobalNavbar } from '@/components/global-navbar'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tf1one.com'),
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
        {/* HubSpot Chat Widget */}
        <script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js-eu1.hs-scripts.com/147558499.js"
        />
      </head>
      <body className="font-sans">
        {/* Suppress InstallTrigger warning - this is from browser extensions, not our code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                
                // Suppress InstallTrigger deprecation warning (from browser extensions)
                try {
                  if (window.InstallTrigger !== undefined) {
                    Object.defineProperty(window, 'InstallTrigger', {
                      value: undefined,
                      writable: false,
                      configurable: false
                    });
                  }
                } catch(e) {
                  // Ignore if cannot suppress
                }
                
                // Suppress Vercel partitioned cookie warnings
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  const message = args.join(' ');
                  if (message.includes('Partitioned cookie') || 
                      message.includes('vercel.live') ||
                      message.includes('InstallTrigger')) {
                    return; // Suppress these warnings
                  }
                  originalWarn.apply(console, args);
                };
              })();
            `,
          }}
        />
        {/* <MSWProvider /> */}
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <SocketProvider>
                <SmoothScrollProvider>
                  <GlobalNavbar />
                  {children}
                  <Footer />
                </SmoothScrollProvider>
                <ScrollToTop />
                <Toaster richColors position="top-center" />
                {/* HubSpot Chat Widget - CSS override for left positioning */}
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                      /* HubSpot Chat Widget - Force left side positioning */
                      #hubspot-messages-iframe-container,
                      #hubspot-conversations-inline-parent {
                        left: 0 !important;
                        right: auto !important;
                      }
                      
                      /* For RTL pages, keep it on the left */
                      [dir="rtl"] #hubspot-messages-iframe-container,
                      [dir="rtl"] #hubspot-conversations-inline-parent {
                        left: 0 !important;
                        right: auto !important;
                      }
                      
                      /* Widget button positioning */
                      #hubspot-messages-iframe-container iframe,
                      #hubspot-conversations-inline-parent iframe {
                        left: 0 !important;
                        right: auto !important;
                      }
                      
                      /* HubSpot widget container adjustments */
                      .hubspot-messages-widget-container {
                        left: 0 !important;
                        right: auto !important;
                      }
                    `,
                  }}
                />
              </SocketProvider>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
