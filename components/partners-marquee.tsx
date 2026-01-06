'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2, Award, TrendingUp, Users, Briefcase, MapPin, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function PartnersMarquee() {
  const { language } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const partners = [
    { 
      name: 'Al Hilal', 
      logo: '/partners/hilal.png',
      category: 'club',
      verified: true,
      jobs: 45,
      location: 'Riyadh'
    },
    { 
      name: 'Al Nassr', 
      logo: '/partners/nassr.png',
      category: 'club',
      verified: true,
      jobs: 38,
      location: 'Riyadh'
    },
    { 
      name: 'Al Ahli', 
      logo: '/partners/ahli.png',
      category: 'club',
      verified: true,
      jobs: 32,
      location: 'Jeddah'
    },
    { 
      name: 'Al Shabab', 
      logo: '/partners/shabab.png',
      category: 'club',
      verified: true,
      jobs: 28,
      location: 'Riyadh'
    },
    { 
      name: 'Al Taawon', 
      logo: '/partners/taawon.png',
      category: 'club',
      verified: true,
      jobs: 25,
      location: 'Buraydah'
    },
    { 
      name: 'Fitness Time', 
      logo: '/partners/fitnesstime.png',
      category: 'fitness',
      verified: true,
      jobs: 67,
      location: 'Multiple'
    },
    { 
      name: 'Diriyah Club', 
      logo: '/partners/diriyah.png',
      category: 'club',
      verified: true,
      jobs: 19,
      location: 'Diriyah'
    },
    { 
      name: 'Al Fateh', 
      logo: '/partners/fateh.png',
      category: 'club',
      verified: true,
      jobs: 22,
      location: 'Al-Ahsa'
    },
  ]

  // Duplicate for seamless loop
  const marqueePartners = [...partners, ...partners, ...partners]

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
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
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200 mb-6">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">
              {language === 'ar' ? 'شركاؤنا المعتمدون' : 'Our Trusted Partners'}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {language === 'ar' 
              ? 'نعمل مع أفضل المؤسسات الرياضية' 
              : 'Working with Top Sports Organizations'}
          </h2>
          
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg sm:text-xl">
            {language === 'ar'
              ? 'نفخر بشراكاتنا الاستراتيجية مع الأندية الرياضية الرائدة والمراكز المتخصصة في المملكة العربية السعودية'
              : 'We are proud of our strategic partnerships with leading sports clubs and specialized centers in Saudi Arabia'}
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Building2, value: '50+', label: language === 'ar' ? 'شريك' : 'Partners' },
              { icon: TrendingUp, value: '500+', label: language === 'ar' ? 'وظيفة نشطة' : 'Active Jobs' },
              { icon: Users, value: '10K+', label: language === 'ar' ? 'باحث عن عمل' : 'Job Seekers' },
              { icon: Award, value: '95%', label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Marquee - Enhanced Design */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>

          {/* First Row - Large Cards */}
          <div className="relative overflow-hidden mb-8">
            <motion.div
              className="flex items-center gap-6 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 60,
              }}
            >
              {marqueePartners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative w-56 h-40 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 overflow-hidden">
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
                      <motion.div
                        className="relative w-32 h-32"
                        animate={{
                          scale: hoveredIndex === index ? 1.1 : 1,
                          rotate: hoveredIndex === index ? 2 : 0,
                        }}
                        transition={{ duration: 0.3 }}
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
                            target.src = '/logo.png' // Fallback image
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Partner Info - Shows on Hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        y: hoveredIndex === index ? 0 : 10,
                      }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 to-transparent p-4 rounded-b-2xl"
                    >
                      <h3 className="text-white font-bold text-sm mb-1">{partner.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <TrendingUp className="w-3 h-3" />
                        <span>{partner.jobs} {language === 'ar' ? 'وظيفة متاحة' : 'Jobs Available'}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Second Row - Smaller Cards (Reverse Direction) */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex items-center gap-4 w-max"
              animate={{ x: ['-50%', '0%'] }}
              transition={{
                repeat: Infinity,
                ease: 'linear',
                duration: 50,
              }}
            >
              {marqueePartners.slice().reverse().map((partner, index) => (
                <motion.div
                  key={`reverse-${partner.name}-${index}`}
                  className="flex-shrink-0 group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-40 h-28 bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:border-blue-200 transition-all duration-300 flex items-center justify-center">
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
                          target.src = '/logo.png' // Fallback image
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
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
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
