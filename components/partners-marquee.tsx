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

  const duplicatedPartners = [...partners, ...partners]

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-green-50/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {language === 'ar' ? 'شركاؤنا المحتملون' : 'Our Potential Partners'}
        </h2>
      </div>
      
      <div className="relative w-full">
        <div className="flex gap-6 sm:gap-8 animate-scroll">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
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

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: fit-content;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
