'use client'

import { useLanguage } from '@/contexts/language-context'
import { motion } from 'framer-motion'
import { Users, Briefcase, Building2, TrendingUp } from 'lucide-react'

export function StatsSection() {
  const { language } = useLanguage()

  const stats = [
    {
      icon: Users,
      number: '+500K',
      label: language === 'ar' ? 'مستخدم نشط' : 'Active Users',
      description: language === 'ar' ? 'من جميع التخصصات' : 'From all specializations',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500',
    },
    {
      icon: Building2,
      number: '+2K',
      label: language === 'ar' ? 'نادي ومركز' : 'Clubs & Centers',
      description: language === 'ar' ? 'في المملكة' : 'In the Kingdom',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500',
    },
    {
      icon: Briefcase,
      number: '+50K',
      label: language === 'ar' ? 'فرصة عمل' : 'Job Opportunities',
      description: language === 'ar' ? 'متاحة الآن' : 'Available Now',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500',
    },
    {
      icon: TrendingUp,
      number: '98%',
      label: language === 'ar' ? 'معدل الرضا' : 'Satisfaction Rate',
      description: language === 'ar' ? 'رضا المستخدمين' : 'User Satisfaction',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500',
    },
  ]

  return (
    <section className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
            {language === 'ar' ? 'نحن TF1' : 'We are TF1'}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            {language === 'ar'
              ? 'منصة توظيف التقنية للرياضة وتمكين المواهب في المملكة'
              : 'Sports tech recruitment platform empowering talents in the Kingdom'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-2xl p-5 sm:p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                  </div>

                  {/* Number */}
                  <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs sm:text-sm text-gray-500">
                    {stat.description}
                  </div>
                </div>

                {/* Decorative Element */}
                <div className={`absolute -bottom-2 -right-2 w-16 h-16 sm:w-20 sm:h-20 ${stat.bgColor} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
