'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Users, Briefcase, Building2, TrendingUp, MapPin, Award } from 'lucide-react'

export function PartnersMarquee() {
  const { language } = useLanguage()

  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: language === 'ar' ? 'مستخدم نشط' : 'Active Users',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Briefcase,
      number: '2,500+',
      label: language === 'ar' ? 'فرصة وظيفية' : 'Job Opportunities',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Building2,
      number: '800+',
      label: language === 'ar' ? 'نادي ومركز رياضي' : 'Clubs & Centers',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: MapPin,
      number: '13',
      label: language === 'ar' ? 'مدينة سعودية' : 'Saudi Cities',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      icon: Award,
      number: '4.8/5',
      label: language === 'ar' ? 'تقييم المستخدمين' : 'User Rating',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
  ]

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            {language === 'ar' ? 'نجاحنا بالأرقام' : 'Our Success in Numbers'}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            {language === 'ar'
              ? 'أرقام تعكس ثقة المجتمع الرياضي في منصتنا'
              : 'Numbers that reflect the sports community trust in our platform'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <IconComponent className={`w-7 h-7 ${stat.iconColor}`} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm sm:text-base">
            {language === 'ar'
              ? 'نخدم المجتمع الرياضي في جميع أنحاء المملكة العربية السعودية 🇸🇦'
              : 'Serving the sports community across Saudi Arabia 🇸🇦'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
