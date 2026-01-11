'use client'

import { useMemo } from 'react'
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
  const firstRowPartners = useMemo(() => allPartners.slice(0, 20), [])
  const secondRowPartners = useMemo(() => allPartners.slice(20), [])

  return (
    <section dir="ltr" className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="marquee-container mb-6">
          <div className="marquee-track">
            {[...firstRowPartners, ...firstRowPartners, ...firstRowPartners].map((partner, index) => (
              <div
                key={`row1-${index}`}
                className="marquee-item"
              >
                <div className="logo-wrapper">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 80px, 120px"
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

        <div className="marquee-container marquee-reverse">
          <div className="marquee-track">
            {[...secondRowPartners, ...secondRowPartners, ...secondRowPartners, ...secondRowPartners].map((partner, index) => (
              <div
                key={`row2-${index}`}
                className="marquee-item"
              >
                <div className="logo-wrapper">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 80px, 120px"
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
        .marquee-container {
          display: flex;
          overflow: hidden;
          width: 100%;
        }
        
        .marquee-track {
          display: flex;
          gap: 3rem;
          animation: scroll 60s linear infinite;
          will-change: transform;
        }
        
        .marquee-reverse .marquee-track {
          animation: scroll-reverse 65s linear infinite;
        }
        
        .marquee-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-wrapper {
          position: relative;
          width: 100px;
          height: 50px;
          filter: grayscale(100%);
          opacity: 0.5;
          transition: filter 0.3s ease, opacity 0.3s ease;
        }
        
        .logo-wrapper:hover {
          filter: grayscale(0%);
          opacity: 1;
        }
        
        @media (min-width: 640px) {
          .marquee-track {
            gap: 4rem;
          }
          .logo-wrapper {
            width: 120px;
            height: 60px;
          }
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100px * 20 - 3rem * 20));
          }
        }
        
        @keyframes scroll-reverse {
          0% {
            transform: translateX(calc(-100px * 20 - 3rem * 20));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @media (min-width: 640px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-120px * 20 - 4rem * 20));
            }
          }
          
          @keyframes scroll-reverse {
            0% {
              transform: translateX(calc(-120px * 20 - 4rem * 20));
            }
            100% {
              transform: translateX(0);
            }
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
