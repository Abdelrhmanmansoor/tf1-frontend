'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, Award, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export function PartnersMarquee() {
  const { language } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // جميع اللوجوهات من مجلد partners
  const allPartners = useMemo(() => [
    // الأندية الرياضية
    { name: 'Al Hilal', logo: '/partners/hilal.png', category: 'club', verified: true },
    { name: 'Al Nassr', logo: '/partners/nassr.png', category: 'club', verified: true },
    { name: 'Al Ahli', logo: '/partners/ahli.png', category: 'club', verified: true },
    { name: 'Al Shabab', logo: '/partners/shabab.png', category: 'club', verified: true },
    { name: 'Al Taawon', logo: '/partners/taawon.png', category: 'club', verified: true },
    { name: 'Al Fateh', logo: '/partners/fateh.png', category: 'club', verified: true },
    { name: 'Al Fateh SC', logo: '/partners/Al Fateh SC-01.png', category: 'club', verified: true },
    { name: 'Al Ittifaq', logo: '/partners/Al Ittifaq-01.png', category: 'club', verified: true },
    { name: 'AlAdalah Club', logo: '/partners/AlAdalah Club-01.png', category: 'club', verified: true },
    { name: 'AlHazem Saudi Club', logo: '/partners/AlHazem Saudi Club-01.png', category: 'club', verified: true },
    { name: 'Alraed SFC', logo: '/partners/Alraed SFC-01.png', category: 'club', verified: true },
    { name: 'Abha Club', logo: '/partners/Abha Club.png', category: 'club', verified: true },
    { name: 'Al Qadisiya', logo: '/partners/qadisiya.png', category: 'club', verified: true },
    { name: 'Qadsiah', logo: '/partners/Qadsiah-04.png', category: 'club', verified: true },
    { name: 'Al Orouba', logo: '/partners/orouba.png', category: 'club', verified: true },
    { name: 'Al Fayha', logo: '/partners/fayha.png', category: 'club', verified: true },
    { name: 'Damak', logo: '/partners/damak.png', category: 'club', verified: true },
    { name: 'Diriyah Club', logo: '/partners/diriyah.png', category: 'club', verified: true },
    { name: 'Al Khulood', logo: '/partners/khulood.png', category: 'club', verified: true },
    
    // الاتحادات الرياضية
    { name: 'SAFF', logo: '/partners/SAFF-02.png', category: 'federation', verified: true },
    { name: 'Saudi Arabian Athletic Federation', logo: '/partners/SAUDI ARABIAN ATHLETIC FEDERATION-01.png', category: 'federation', verified: true },
    { name: 'Saudi Tennis Federation', logo: '/partners/Saudi Tennis Federation.png', category: 'federation', verified: true },
    { name: 'Saudi Jiu-Jitsu Federation', logo: '/partners/Saudi Jiu-Jitsu Federation2.png', category: 'federation', verified: true },
    { name: 'Saudi Esport', logo: '/partners/Saudi Esport-02.png', category: 'federation', verified: true },
    { name: 'Saudi Bowling Federation', logo: '/partners/Saudi Bowling Federation2.png', category: 'federation', verified: true },
    { name: 'Saudi-Federation-of-Mass-Participation', logo: '/partners/Saudi-Federation-of-Mass-Participation-01.png', category: 'federation', verified: true },
    { name: 'Saudi arabian equestrian federation', logo: '/partners/Saudi arabian equestrian federation.png', category: 'federation', verified: true },
    { name: 'Saudi Arabian Hot Air Ballooning Federation', logo: '/partners/Saudi Arabian Hot Air Ballooning Federation-01.png', category: 'federation', verified: true },
    { name: 'saudi archery federation', logo: '/partners/saudi archery federation.png', category: 'federation', verified: true },
    { name: 'Saudi badminton federation', logo: '/partners/Saudi badminton federation (2).png', category: 'federation', verified: true },
    { name: 'saudi baseball and softball federation', logo: '/partners/saudi baseball and softball federation.png', category: 'federation', verified: true },
    { name: 'Saudi climbing and hiking federation', logo: '/partners/Saudi climbing and hiking federation.png', category: 'federation', verified: true },
    { name: 'saudi cycling', logo: '/partners/saudi cycling.png', category: 'federation', verified: true },
    { name: 'saudi dodgeball federation', logo: '/partners/saudi dodgeball federation.png', category: 'federation', verified: true },
    { name: 'Saudi hockey federation', logo: '/partners/Saudi hockey federation.png', category: 'federation', verified: true },
    { name: 'Saudi kickboxing federation', logo: '/partners/Saudi kickboxing federation.png', category: 'federation', verified: true },
    { name: 'Saudi muaythai federation', logo: '/partners/Saudi muaythai federation.png', category: 'federation', verified: true },
    { name: 'Saudi polo federation', logo: '/partners/Saudi polo federation.png', category: 'federation', verified: true },
    { name: 'Saudi rowing federation', logo: '/partners/Saudi rowing federation.png', category: 'federation', verified: true },
    { name: 'Saudi Sailing Federation', logo: '/partners/Saudi Sailing Federation.png', category: 'federation', verified: true },
    { name: 'Saudi Water Sports & Diving Federation', logo: '/partners/Saudi Water Sports & Diving Federation.png', category: 'federation', verified: true },
    
    // الدوري والمنظمات
    { name: 'Roshn Saudi League', logo: '/partners/Roshn Saudi League-01.png', category: 'league', verified: true },
    { name: 'National Transformation Program', logo: '/partners/National Transformation Program.png', category: 'organization', verified: true },
    { name: 'National Events Center', logo: '/partners/National Events Center-01.png', category: 'organization', verified: true },
    { name: 'Saudi Events', logo: '/partners/Saudi Events-01.png', category: 'organization', verified: true },
    
    // المستشفيات والرعاية الصحية
    { name: 'King Faisal Specialist Hospital & Research Centre', logo: '/partners/King Faisal Specialist Hospital & Research Centre.png', category: 'healthcare', verified: true },
    { name: 'Saudi German Health', logo: '/partners/Saudi German Health.png', category: 'healthcare', verified: true },
    { name: 'AlMoosa Hospital', logo: '/partners/AlMoosa Hospital.png', category: 'healthcare', verified: true },
    { name: 'almoosa health', logo: '/partners/almoosa health.png', category: 'healthcare', verified: true },
    
    // الوزارات
    { name: 'Ministry of Commerce and Investment', logo: '/partners/Minisrty-of-Commerce-and-Investment-01.png', category: 'ministry', verified: true },
    { name: 'Ministry of Education', logo: '/partners/Minisrty-of-Education-01-1-1.png', category: 'ministry', verified: true },
    { name: 'Ministry of Labor and Social Development', logo: '/partners/Ministry-of-Labor-and-Social-Development.png', category: 'ministry', verified: true },
    
    // مراكز الأعمال
    { name: 'Saudi Business Center', logo: '/partners/Saudi Business Center-01.png', category: 'business', verified: true },
    
    // مراكز اللياقة
    { name: 'Fitness Time', logo: '/partners/fitnesstime.png', category: 'fitness', verified: true },
  ], [])

  // إنشاء نسخ متعددة للشريط المستمر - نكرر 3 مرات
  const marqueePartners = useMemo(() => {
    return [...allPartners, ...allPartners, ...allPartners]
  }, [allPartners])
  
  const stats = useMemo(() => [
    { icon: Building2, value: `${allPartners.length}+`, label: language === 'ar' ? 'شريك' : 'Partners' },
    { icon: TrendingUp, value: '500+', label: language === 'ar' ? 'وظيفة نشطة' : 'Active Jobs' },
    { icon: Users, value: '10K+', label: language === 'ar' ? 'باحث عن عمل' : 'Job Seekers' },
    { icon: Award, value: '95%', label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction' },
  ], [language, allPartners.length])

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white" style={{ minHeight: '600px' }}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          role="region"
          aria-labelledby="partners-heading"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200 mb-6">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              {language === 'ar' ? 'شركاؤنا المعتمدون' : 'Our Trusted Partners'}
            </span>
          </div>
          
          <h2 id="partners-heading" className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {language === 'ar' 
              ? 'نعمل مع أفضل المؤسسات الرياضية' 
              : 'Working with Top Sports Organizations'}
          </h2>
          
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg sm:text-xl">
            {language === 'ar'
              ? 'نفخر بشراكاتنا الاستراتيجية مع الأندية الرياضية الرائدة والاتحادات والمراكز المتخصصة في المملكة العربية السعودية'
              : 'We are proud of our strategic partnerships with leading sports clubs, federations, and specialized centers in Saudi Arabia'}
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto" role="list" aria-label={language === 'ar' ? 'إحصائيات الشركاء' : 'Partners Statistics'}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                role="listitem"
                aria-label={`${stat.value} ${stat.label}`}
              >
                <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" aria-hidden="true" />
                <div className="text-2xl font-bold text-gray-900" aria-label={stat.value}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Marquee - Fixed Continuous Scroll */}
        <div className="relative my-12" style={{ minHeight: '320px' }}>
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-none"></div>

          {/* First Row - Large Cards - Continuous Scroll */}
          <div className="relative overflow-hidden mb-8" style={{ height: '180px', width: '100%' }}>
            <motion.div
              className="flex items-center gap-6"
              animate={{ 
                x: [0, -(224 * allPartners.length + 24 * (allPartners.length - 1))]
              }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 40,
                repeatType: 'loop',
              }}
              style={{ width: 'max-content' }}
            >
              {marqueePartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 group relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ width: '224px', height: '160px' }}
                >
                  <div className="relative w-full h-full bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 overflow-hidden">
                    {/* Gradient Background on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Verified Badge */}
                    {partner.verified && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-green-500 text-white rounded-full p-1.5">
                          <Award className="w-3 h-3" />
                        </div>
                      </div>
                    )}

                    {/* Logo Container */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div
                        className="relative w-32 h-32 transition-transform duration-300"
                        style={{
                          transform: hoveredIndex === index ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)'
                        }}
                      >
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          sizes="(max-width: 768px) 150px, 200px"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/logo.png'
                          }}
                        />
                      </div>
                    </div>

                    {/* Partner Info - Shows on Hover */}
                    {hoveredIndex === index && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4 rounded-b-2xl">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{partner.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <span className="capitalize">{partner.category}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Smaller Cards (Reverse Direction) - Continuous Scroll */}
          <div className="relative overflow-hidden" style={{ height: '120px' }}>
            <motion.div
              className="flex items-center gap-4"
              animate={{ 
                x: [-(160 * allPartners.length + 16 * (allPartners.length - 1)), 0]
              }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 35,
                repeatType: 'loop',
              }}
              style={{ width: 'max-content' }}
            >
              {marqueePartners.slice().reverse().map((partner, index) => (
                <div
                  key={`reverse-${partner.name}-${index}`}
                  className="flex-shrink-0 group"
                  style={{ width: '160px', height: '112px' }}
                >
                  <div className="w-full h-full bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 flex items-center justify-center">
                    <div className="relative w-24 h-24 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        sizes="120px"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/logo.png'
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              {language === 'ar' 
                ? 'هل تريد أن تصبح شريكاً معنا؟' 
                : 'Want to Become a Partner?'}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {language === 'ar'
                ? 'انضم إلى شبكة الشركاء المميزين واستفد من وصولنا الواسع إلى آلاف الباحثين عن عمل المؤهلين'
                : 'Join our network of distinguished partners and benefit from our wide reach to thousands of qualified job seekers'}
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              aria-label={language === 'ar' ? 'تواصل معنا للانضمام كشريك' : 'Contact us to become a partner'}
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
