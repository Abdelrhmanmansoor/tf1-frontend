'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'

interface Partner {
  name: string
  logo: string
}

const allPartners: Partner[] = [
  { name: 'Al Hilal', logo: '/partners/hilal.png' },
  { name: 'Al Nassr', logo: '/partners/nassr.png' },
  { name: 'Al Ahli', logo: '/partners/ahli.png' },
  { name: 'Al Shabab', logo: '/partners/shabab.png' },
  { name: 'Al Taawon', logo: '/partners/taawon.png' },
  { name: 'Al Fateh', logo: '/partners/fateh.png' },
  { name: 'Al Fateh SC', logo: '/partners/Al Fateh SC-01.png' },
  { name: 'Al Ittifaq', logo: '/partners/Al Ittifaq-01.png' },
  { name: 'AlAdalah Club', logo: '/partners/AlAdalah Club-01.png' },
  { name: 'AlHazem Saudi Club', logo: '/partners/AlHazem Saudi Club-01.png' },
  { name: 'Alraed SFC', logo: '/partners/Alraed SFC-01.png' },
  { name: 'Abha Club', logo: '/partners/Abha Club.png' },
  { name: 'Al Qadisiya', logo: '/partners/qadisiya.png' },
  { name: 'Qadsiah', logo: '/partners/Qadsiah-04.png' },
  { name: 'Al Orouba', logo: '/partners/orouba.png' },
  { name: 'Al Fayha', logo: '/partners/fayha.png' },
  { name: 'Damak', logo: '/partners/damak.png' },
  { name: 'Diriyah Club', logo: '/partners/diriyah.png' },
  { name: 'Al Khulood', logo: '/partners/khulood.png' },
  { name: 'SAFF', logo: '/partners/SAFF-02.png' },
  { name: 'Saudi Athletic Federation', logo: '/partners/SAUDI ARABIAN ATHLETIC FEDERATION-01.png' },
  { name: 'Saudi Tennis Federation', logo: '/partners/Saudi Tennis Federation.png' },
  { name: 'Saudi Jiu-Jitsu Federation', logo: '/partners/Saudi Jiu-Jitsu Federation2.png' },
  { name: 'Saudi Esport', logo: '/partners/Saudi Esport-02.png' },
  { name: 'Saudi Bowling Federation', logo: '/partners/Saudi Bowling Federation2.png' },
  { name: 'Mass Participation Federation', logo: '/partners/Saudi-Federation-of-Mass-Participation-01.png' },
  { name: 'Equestrian Federation', logo: '/partners/Saudi arabian equestrian federation.png' },
  { name: 'Archery Federation', logo: '/partners/saudi archery federation.png' },
  { name: 'Badminton Federation', logo: '/partners/Saudi badminton federation (2).png' },
  { name: 'Saudi Cycling', logo: '/partners/saudi cycling.png' },
  { name: 'Hockey Federation', logo: '/partners/Saudi hockey federation.png' },
  { name: 'Sailing Federation', logo: '/partners/Saudi Sailing Federation.png' },
  { name: 'Roshn Saudi League', logo: '/partners/Roshn Saudi League-01.png' },
  { name: 'National Events Center', logo: '/partners/National Events Center-01.png' },
  { name: 'Saudi Events', logo: '/partners/Saudi Events-01.png' },
  { name: 'King Faisal Hospital', logo: '/partners/King Faisal Specialist Hospital & Research Centre.png' },
  { name: 'Saudi German Health', logo: '/partners/Saudi German Health.png' },
  { name: 'Ministry of Commerce', logo: '/partners/Minisrty-of-Commerce-and-Investment-01.png' },
  { name: 'Ministry of Education', logo: '/partners/Minisrty-of-Education-01-1-1.png' },
  { name: 'Fitness Time', logo: '/partners/fitnesstime.png' },
]

export default function PremiumPartners() {
  const { language } = useLanguage()

  const firstRowPartners = useMemo(() => allPartners.slice(0, 20), [])
  const secondRowPartners = useMemo(() => allPartners.slice(20), [])

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-center text-xs sm:text-sm font-medium tracking-[0.2em] text-gray-400 uppercase">
          {language === 'ar' ? 'نعمل مع أفضل المؤسسات الرياضية' : 'We work with top sports organizations'}
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex overflow-hidden mb-8">
          <div className="flex animate-marquee">
            {[...firstRowPartners, ...firstRowPartners].map((partner, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 mx-6 sm:mx-10"
              >
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 128px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee" aria-hidden="true">
            {[...firstRowPartners, ...firstRowPartners].map((partner, index) => (
              <div
                key={`row1-dup-${index}`}
                className="flex-shrink-0 mx-6 sm:mx-10"
              >
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 128px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex overflow-hidden">
          <div className="flex animate-marquee-reverse">
            {[...secondRowPartners, ...secondRowPartners].map((partner, index) => (
              <div
                key={`row2-${index}`}
                className="flex-shrink-0 mx-6 sm:mx-10"
              >
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 128px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee-reverse" aria-hidden="true">
            {[...secondRowPartners, ...secondRowPartners].map((partner, index) => (
              <div
                key={`row2-dup-${index}`}
                className="flex-shrink-0 mx-6 sm:mx-10"
              >
                <div className="relative w-24 h-12 sm:w-32 sm:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 96px, 128px"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo.png'
                    }}
                  />
                </div>
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
            transform: translateX(-100%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
