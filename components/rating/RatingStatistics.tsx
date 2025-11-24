'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { StarRating } from './StarRating'
import type { ReviewStatistics } from '@/services/rating'

interface RatingStatisticsProps {
  statistics: ReviewStatistics
  className?: string
}

export function RatingStatistics({
  statistics,
  className = '',
}: RatingStatisticsProps) {
  const { language } = useLanguage()

  const detailedRatingLabels = {
    professionalism: language === 'ar' ? 'الاحترافية' : 'Professionalism',
    communication: language === 'ar' ? 'التواصل' : 'Communication',
    expertise: language === 'ar' ? 'الخبرة' : 'Expertise',
    punctuality: language === 'ar' ? 'الالتزام بالمواعيد' : 'Punctuality',
    value: language === 'ar' ? 'القيمة' : 'Value',
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      {/* Overall Rating */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          {statistics.averageRating.toFixed(1)}
        </motion.h1>
        <div className="flex justify-center mb-2">
          <StarRating rating={statistics.averageRating} size="lg" />
        </div>
        <p className="text-gray-600">
          {statistics.totalReviews} {language === 'ar' ? 'تقييم' : 'reviews'}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">
          {language === 'ar' ? 'توزيع التقييمات' : 'Rating Distribution'}
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              statistics.ratingDistribution[
                star.toString() as '5' | '4' | '3' | '2' | '1'
              ] || 0
            const percentage =
              statistics.totalReviews > 0
                ? (count / statistics.totalReviews) * 100
                : 0

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 w-8">{star} ⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: star * 0.1 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Averages */}
      {statistics.detailedAverages &&
        Object.keys(statistics.detailedAverages).length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {language === 'ar'
                ? 'متوسط التقييمات التفصيلية'
                : 'Detailed Averages'}
            </h3>
            <div className="space-y-3">
              {Object.entries(statistics.detailedAverages).map(
                ([category, rating]) =>
                  rating && (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700 capitalize">
                          {
                            detailedRatingLabels[
                              category as keyof typeof detailedRatingLabels
                            ]
                          }
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(rating / 5) * 100}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
    </div>
  )
}
