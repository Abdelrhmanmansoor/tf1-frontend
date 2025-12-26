'use client'

import { Opportunity } from '@/services/opportunities'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin,
  Clock,
  Users,
  Briefcase,
  DollarSign,
} from 'lucide-react'

interface OpportunityCardProps {
  opportunity: Opportunity
}

const OpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  const { language } = useLanguage()

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  )

  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      permanent: { en: 'Permanent', ar: 'دائم' },
      seasonal: { en: 'Seasonal', ar: 'موسمي' },
      temporary: { en: 'Temporary', ar: 'مؤقت' },
      trial: { en: 'Trial', ar: 'تجريبي' },
      internship: { en: 'Internship', ar: 'تدريب' },
      volunteer: { en: 'Volunteer', ar: 'تطوع' },
    }
    return labels[type]
      ? language === 'ar'
        ? labels[type].ar
        : labels[type].en
      : type
  }

  return (
    <Link href={`/opportunities/${opportunity._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      >
        {/* Urgent Badge */}
        {isUrgent && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {language === 'ar' ? 'عاجل' : 'Urgent'}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Club Logo */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
            {opportunity.club.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={opportunity.club.logo}
                alt={opportunity.club.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* Title & Club */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
              {opportunity.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {opportunity.club.name}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="truncate">{opportunity.location}</span>
          </div>

          {/* Job Type */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="w-4 h-4 text-purple-500" />
            <span className="truncate">
              {getJobTypeLabel(opportunity.jobType)}
            </span>
          </div>

          {/* Sport */}
          {opportunity.sport && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">⚽</span>
              <span className="truncate capitalize">{opportunity.sport}</span>
            </div>
          )}

          {/* Position */}
          {opportunity.position && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">🎯</span>
              <span className="truncate">{opportunity.position}</span>
            </div>
          )}

          {/* Salary */}
          {opportunity.salaryRange && (
            <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-700">
                {opportunity.salaryRange}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Deadline */}
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-gray-400'}`}
            />
            <span
              className={`text-sm ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}
            >
              {daysUntilDeadline > 0
                ? language === 'ar'
                  ? `${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'يوم' : 'أيام'} متبقية`
                  : `${daysUntilDeadline} day${daysUntilDeadline !== 1 ? 's' : ''} left`
                : language === 'ar'
                  ? 'انتهى الموعد'
                  : 'Deadline passed'}
            </span>
          </div>

          {/* Applications Count */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {opportunity.applicationCount}{' '}
              {language === 'ar'
                ? opportunity.applicationCount === 1
                  ? 'متقدم'
                  : 'متقدمين'
                : opportunity.applicationCount === 1
                  ? 'applicant'
                  : 'applicants'}
            </span>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </motion.div>
    </Link>
  )
}

export default OpportunityCard
