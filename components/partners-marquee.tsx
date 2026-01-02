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

  return (
    <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'شركاؤنا المحتملون' : 'Our Potential Partners'}
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-base sm:text-lg">
          {language === 'ar'
            ? 'نتطلع لبناء شراكات استراتيجية مع الأندية الرياضية والأكاديميات والاتحادات ومراكز التأهيل الرياضي، بما يدعم تطوير القطاع الرياضي ويعزز من جودة الخدمات المقدمة عبر منصتنا.'
            : 'We look forward to building strategic partnerships with sports clubs, academies, federations, and sports rehabilitation centers, supporting the development of the sports sector and enhancing the quality of services provided through our platform.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {partners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="group flex items-center justify-center bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 h-32 sm:h-40 relative"
            >
              <div className="relative w-full h-full p-2 transition-opacity duration-300 group-hover:opacity-80">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center border-t border-gray-100 pt-8">
          <p className="text-gray-500 font-medium">
            {language === 'ar'
              ? 'يسعدنا انضمامكم لشركائنا ودعم مسيرة التطوير في القطاع الرياضي.'
              : 'We are happy to have you join our partners and support the development journey in the sports sector.'}
          </p>
        </div>
      </div>
    </section>
  )
}
