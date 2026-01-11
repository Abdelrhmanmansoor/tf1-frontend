'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion, useInView } from 'framer-motion'
import { Award, Building2, TrendingUp, Users, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'

interface Partner {
  name: string
  logo: string
  category: string
  verified: boolean
}

const allPartners: Partner[] = [
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
  { name: 'SAFF', logo: '/partners/SAFF-02.png', category: 'federation', verified: true },
  { name: 'Saudi Athletic Federation', logo: '/partners/SAUDI ARABIAN ATHLETIC FEDERATION-01.png', category: 'federation', verified: true },
  { name: 'Saudi Tennis Federation', logo: '/partners/Saudi Tennis Federation.png', category: 'federation', verified: true },
  { name: 'Saudi Jiu-Jitsu Federation', logo: '/partners/Saudi Jiu-Jitsu Federation2.png', category: 'federation', verified: true },
  { name: 'Saudi Esport', logo: '/partners/Saudi Esport-02.png', category: 'federation', verified: true },
  { name: 'Saudi Bowling Federation', logo: '/partners/Saudi Bowling Federation2.png', category: 'federation', verified: true },
  { name: 'Mass Participation Federation', logo: '/partners/Saudi-Federation-of-Mass-Participation-01.png', category: 'federation', verified: true },
  { name: 'Equestrian Federation', logo: '/partners/Saudi arabian equestrian federation.png', category: 'federation', verified: true },
  { name: 'Hot Air Ballooning', logo: '/partners/Saudi Arabian Hot Air Ballooning Federation-01.png', category: 'federation', verified: true },
  { name: 'Archery Federation', logo: '/partners/saudi archery federation.png', category: 'federation', verified: true },
  { name: 'Badminton Federation', logo: '/partners/Saudi badminton federation (2).png', category: 'federation', verified: true },
  { name: 'Baseball Federation', logo: '/partners/saudi baseball and softball federation.png', category: 'federation', verified: true },
  { name: 'Climbing Federation', logo: '/partners/Saudi climbing and hiking federation.png', category: 'federation', verified: true },
  { name: 'Saudi Cycling', logo: '/partners/saudi cycling.png', category: 'federation', verified: true },
  { name: 'Dodgeball Federation', logo: '/partners/saudi dodgeball federation.png', category: 'federation', verified: true },
  { name: 'Hockey Federation', logo: '/partners/Saudi hockey federation.png', category: 'federation', verified: true },
  { name: 'Kickboxing Federation', logo: '/partners/Saudi kickboxing federation.png', category: 'federation', verified: true },
  { name: 'Muaythai Federation', logo: '/partners/Saudi muaythai federation.png', category: 'federation', verified: true },
  { name: 'Polo Federation', logo: '/partners/Saudi polo federation.png', category: 'federation', verified: true },
  { name: 'Rowing Federation', logo: '/partners/Saudi rowing federation.png', category: 'federation', verified: true },
  { name: 'Sailing Federation', logo: '/partners/Saudi Sailing Federation.png', category: 'federation', verified: true },
  { name: 'Water Sports Federation', logo: '/partners/Saudi Water Sports & Diving Federation.png', category: 'federation', verified: true },
  { name: 'Roshn Saudi League', logo: '/partners/Roshn Saudi League-01.png', category: 'league', verified: true },
  { name: 'National Transformation', logo: '/partners/National Transformation Program.png', category: 'organization', verified: true },
  { name: 'National Events Center', logo: '/partners/National Events Center-01.png', category: 'organization', verified: true },
  { name: 'Saudi Events', logo: '/partners/Saudi Events-01.png', category: 'organization', verified: true },
  { name: 'King Faisal Hospital', logo: '/partners/King Faisal Specialist Hospital & Research Centre.png', category: 'healthcare', verified: true },
  { name: 'Saudi German Health', logo: '/partners/Saudi German Health.png', category: 'healthcare', verified: true },
  { name: 'AlMoosa Hospital', logo: '/partners/AlMoosa Hospital.png', category: 'healthcare', verified: true },
  { name: 'Ministry of Commerce', logo: '/partners/Minisrty-of-Commerce-and-Investment-01.png', category: 'ministry', verified: true },
  { name: 'Ministry of Education', logo: '/partners/Minisrty-of-Education-01-1-1.png', category: 'ministry', verified: true },
  { name: 'Ministry of Labor', logo: '/partners/Ministry-of-Labor-and-Social-Development.png', category: 'ministry', verified: true },
  { name: 'Saudi Business Center', logo: '/partners/Saudi Business Center-01.png', category: 'business', verified: true },
  { name: 'Fitness Time', logo: '/partners/fitnesstime.png', category: 'fitness', verified: true },
]

function PartnerCard({ partner, index, isHovered, onHover, onLeave }: {
  partner: Partner
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <motion.div
      className="relative group cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02, duration: 0.4 }}
    >
      <div className={`
        relative h-40 sm:h-44 rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/80 to-white/40
        backdrop-blur-xl
        border border-white/40
        shadow-[0_8px_32px_rgba(0,0,0,0.08)]
        transition-all duration-500 ease-out
        ${isHovered ? 'scale-105 shadow-[0_20px_60px_rgba(59,130,246,0.25)] border-blue-300/60' : ''}
      `}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
        </div>

        {partner.verified && (
          <motion.div 
            className="absolute top-3 right-3 z-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full p-1.5 shadow-lg shadow-green-500/30">
              <Award className="w-3 h-3" />
            </div>
          </motion.div>
        )}

        <div className="relative w-full h-full flex items-center justify-center p-6">
          <div className={`
            relative w-24 h-24 sm:w-28 sm:h-28 
            transition-all duration-500 ease-out
            ${isHovered ? 'scale-110' : 'scale-100'}
          `}>
            <Image
              src={partner.logo}
              alt={partner.name}
              fill
              className={`
                object-contain 
                transition-all duration-500 ease-out
                ${isHovered ? 'grayscale-0 brightness-100' : 'grayscale brightness-90 opacity-70'}
              `}
              sizes="(max-width: 768px) 100px, 120px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/logo.png'
              }}
            />
          </div>
        </div>

        <div className={`
          absolute bottom-0 left-0 right-0 
          bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent 
          p-4 pt-8
          transform transition-all duration-500 ease-out
          ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
        `}>
          <h3 className="text-white font-bold text-sm truncate">{partner.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-blue-300 capitalize bg-blue-500/20 px-2 py-0.5 rounded-full">
              {partner.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PremiumPartners() {
  const { language } = useLanguage()
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)
  const swiperRef2 = useRef<SwiperType | null>(null)

  const stats = useMemo(() => [
    { icon: Building2, value: `${allPartners.length}+`, labelAr: 'شريك رسمي', labelEn: 'Official Partners' },
    { icon: TrendingUp, value: '500+', labelAr: 'وظيفة نشطة', labelEn: 'Active Jobs' },
    { icon: Users, value: '10K+', labelAr: 'باحث عن عمل', labelEn: 'Job Seekers' },
    { icon: Award, value: '95%', labelAr: 'معدل الرضا', labelEn: 'Satisfaction Rate' },
  ], [])

  const handleMouseEnter = () => {
    setIsPaused(true)
    swiperRef.current?.autoplay?.stop()
    swiperRef2.current?.autoplay?.stop()
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    swiperRef.current?.autoplay?.start()
    swiperRef2.current?.autoplay?.start()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]" />
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-blue-400/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {language === 'ar' ? '+50 شريك رسمي معتمد' : '50+ Verified Official Partners'}
            </span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {language === 'ar' ? (
              <>
                <span className="block">شركاؤنا</span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  المعتمدون
                </span>
              </>
            ) : (
              <>
                <span className="block">Our Trusted</span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Partners
                </span>
              </>
            )}
          </h2>
          
          <p className="max-w-3xl mx-auto text-gray-400 text-lg sm:text-xl leading-relaxed">
            {language === 'ar'
              ? 'نفخر بشراكاتنا الاستراتيجية مع أعرق المؤسسات الرياضية والأندية الرائدة والاتحادات المتخصصة في المملكة العربية السعودية'
              : 'We proudly partner with the most prestigious sports organizations, leading clubs, and specialized federations across Saudi Arabia'}
          </p>

          <motion.div 
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative group"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">
                    {language === 'ar' ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-20 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-20 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />

          <div className="mb-6">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={20}
              slidesPerView="auto"
              loop={true}
              speed={shouldReduceMotion ? 0 : 5000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              freeMode={{
                enabled: true,
                momentum: false,
              }}
              allowTouchMove={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper
              }}
              className="!overflow-visible"
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                640: { slidesPerView: 3, spaceBetween: 16 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 24 },
                1280: { slidesPerView: 6, spaceBetween: 24 },
              }}
            >
              {[...allPartners, ...allPartners].map((partner, index) => (
                <SwiperSlide key={`row1-${index}`} style={{ width: 'auto' }}>
                  <PartnerCard
                    partner={partner}
                    index={index}
                    isHovered={hoveredIndex === index}
                    onHover={() => setHoveredIndex(index)}
                    onLeave={() => setHoveredIndex(null)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div>
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={20}
              slidesPerView="auto"
              loop={true}
              speed={shouldReduceMotion ? 0 : 6000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                reverseDirection: true,
              }}
              freeMode={{
                enabled: true,
                momentum: false,
              }}
              allowTouchMove={true}
              onSwiper={(swiper) => {
                swiperRef2.current = swiper
              }}
              className="!overflow-visible"
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                640: { slidesPerView: 3, spaceBetween: 16 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 24 },
                1280: { slidesPerView: 6, spaceBetween: 24 },
              }}
            >
              {[...allPartners.slice().reverse(), ...allPartners.slice().reverse()].map((partner, index) => (
                <SwiperSlide key={`row2-${index}`} style={{ width: 'auto' }}>
                  <PartnerCard
                    partner={partner}
                    index={index + 100}
                    isHovered={hoveredIndex === index + 100}
                    onHover={() => setHoveredIndex(index + 100)}
                    onLeave={() => setHoveredIndex(null)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-20 text-center">
          <motion.div 
            className="inline-block relative"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-10 sm:p-12">
                            
              <h3 className="relative text-2xl sm:text-3xl font-bold text-white mb-4">
                {language === 'ar' 
                  ? 'هل تريد أن تصبح شريكاً معتمداً؟' 
                  : 'Want to Become a Verified Partner?'}
              </h3>
              <p className="relative text-blue-100/80 mb-8 max-w-xl mx-auto text-lg">
                {language === 'ar'
                  ? 'انضم إلى شبكة الشركاء المميزين واستفد من وصولنا الواسع لآلاف الكفاءات الرياضية المؤهلة'
                  : 'Join our distinguished partner network and gain access to thousands of qualified sports professionals'}
              </p>
              <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <span>{language === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}</span>
                  <ChevronLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${language === 'en' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 text-white/90 hover:text-white px-6 py-4 rounded-xl font-semibold border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  {language === 'ar' ? 'استعرض جميع الشركاء' : 'View All Partners'}
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
