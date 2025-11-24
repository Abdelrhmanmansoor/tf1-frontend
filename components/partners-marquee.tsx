'use client'

import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

export function PartnersMarquee() {
  const { language } = useLanguage()

  const partners = [
    { name: 'Al Hilal', logo: '/partners/hilal.png' },
    { name: 'Al Nassr', logo: '/partners/nassr.png' },
    { name: 'Al Ahli', logo: '/partners/ahli.png' },
    { name: 'Al Shabab', logo: '/partners/shabab.png' },
    { name: 'Al Taawon', logo: '/partners/taawon.png' },
    { name: 'Al Khulood', logo: '/partners/khulood.png' },
    { name: 'Diriyah Club', logo: '/partners/diriyah.png' },
    { name: 'Al Fateh', logo: '/partners/fateh.png' },
    { name: 'Al Qadisiya', logo: '/partners/qadisiya.png' },
    { name: 'Al Orouba', logo: '/partners/orouba.png' },
    { name: 'Al Fayha', logo: '/partners/fayha.png' },
    { name: 'Damak', logo: '/partners/damak.png' },
    { name: 'Fitness Time', logo: '/partners/fitnesstime.png' },
  ]

  const allPartners = [...partners, ...partners]

  return (
    <section className="py-12 sm:py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
          {language === 'ar' ? 'شركاؤنا المحتملون' : 'Our Potential Partners'}
        </h2>
        
        <div className="relative">
          <div className="flex gap-8 sm:gap-12 animate-marquee">
            {allPartners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 40s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
