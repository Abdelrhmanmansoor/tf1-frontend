'use client'

import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import { motion } from 'framer-motion'

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

  const marqueePartners = [...partners, ...partners]

  return (
    <section className="py-20 sm:py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          {language === 'ar' ? 'شركاؤنا المحتملون' : 'Our Potential Partners'}
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg sm:text-xl">
          {language === 'ar'
            ? 'نتطلع لبناء شراكات استراتيجية مع الأندية الرياضية والأكاديميات والاتحادات ومراكز التأهيل الرياضي، بما يدعم تطوير القطاع الرياضي ويعزز من جودة الخدمات المقدمة عبر منصتنا.'
            : 'We look forward to building strategic partnerships with sports clubs, academies, federations, and sports rehabilitation centers, supporting the development of the sports sector and enhancing the quality of services provided through our platform.'}
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>

        <motion.div
          className="flex items-center gap-8 sm:gap-12 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 40,
          }}
        >
          {marqueePartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-40 h-32 sm:w-48 sm:h-40 bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center group hover:shadow-md hover:border-blue-100 transition-all duration-300"
            >
              <div className="relative w-full h-full p-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 150px, 200px"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-16 text-center border-t border-gray-200 pt-10 max-w-4xl mx-auto px-4">
        <p className="text-gray-500 font-medium text-lg">
          {language === 'ar'
            ? 'يسعدنا انضمامكم لشركائنا ودعم مسيرة التطوير في القطاع الرياضي.'
            : 'We are happy to have you join our partners and support the development journey in the sports sector.'}
        </p>
      </div>
    </section>
  )
}
