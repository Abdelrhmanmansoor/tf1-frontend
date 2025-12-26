'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { StarRating } from './StarRating'
import { ThumbsUp, ThumbsDown, Flag, MessageSquare } from 'lucide-react'
import type { Review } from '@/services/rating'

interface ReviewCardProps {
  review: Review
  onMarkHelpful?: (_reviewId: string) => void
  onMarkNotHelpful?: (_reviewId: string) => void
  onReport?: (_reviewId: string, _reason: string) => void
  currentUserId?: string
}

export function ReviewCard({
  review,
  onMarkHelpful,
  onMarkNotHelpful,
  onReport,
  currentUserId,
}: ReviewCardProps) {
  const { language } = useLanguage()
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleReport = () => {
    if (reportReason.trim() && onReport) {
      onReport(review._id, reportReason)
      setShowReportDialog(false)
      setReportReason('')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      {/* Reviewer Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.reviewerId.profileImage || '/default-avatar.png'}
          alt={review.reviewerId.firstName}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                {review.reviewerId.firstName} {review.reviewerId.lastName}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
            <StarRating rating={review.rating} size="md" showNumber />
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
      )}

      {/* Review Text */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
        {language === 'ar' && review.reviewAr ? review.reviewAr : review.review}
      </p>

      {/* Detailed Ratings */}
      {review.detailedRatings &&
        Object.keys(review.detailedRatings).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {language === 'ar' ? 'التقييمات التفصيلية' : 'Detailed Ratings'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(review.detailedRatings).map(
                ([category, rating]) =>
                  rating && (
                    <div key={category} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 capitalize">
                        {language === 'ar'
                          ? {
                              professionalism: 'الاحترافية',
                              communication: 'التواصل',
                              expertise: 'الخبرة',
                              punctuality: 'الالتزام',
                              value: 'القيمة',
                            }[category]
                          : category}
                        :
                      </span>
                      <StarRating rating={rating} size="sm" />
                    </div>
                  )
              )}
            </div>
          </div>
        )}

      {/* Response */}
      {review.response && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-semibold text-blue-900">
              {language === 'ar' ? 'الرد' : 'Response'}
            </p>
          </div>
          <p className="text-sm text-blue-900">
            {language === 'ar' && review.response.textAr
              ? review.response.textAr
              : review.response.text}
          </p>
          <p className="text-xs text-blue-700 mt-2">
            {formatDate(review.response.respondedAt)}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        {onMarkHelpful && (
          <button
            onClick={() => onMarkHelpful(review._id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>
              {language === 'ar' ? 'مفيد' : 'Helpful'} ({review.helpfulCount})
            </span>
          </button>
        )}

        {onMarkNotHelpful && (
          <button
            onClick={() => onMarkNotHelpful(review._id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <ThumbsDown className="w-4 h-4" />
            <span>({review.notHelpfulCount})</span>
          </button>
        )}

        {onReport && currentUserId !== review.reviewerId._id && (
          <button
            onClick={() => setShowReportDialog(true)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors ml-auto"
          >
            <Flag className="w-4 h-4" />
            <span>{language === 'ar' ? 'إبلاغ' : 'Report'}</span>
          </button>
        )}
      </div>

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'إبلاغ عن التقييم' : 'Report Review'}
            </h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder={
                language === 'ar' ? 'السبب...' : 'Reason for reporting...'
              }
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleReport}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition-colors"
              >
                {language === 'ar' ? 'إرسال' : 'Submit'}
              </button>
              <button
                onClick={() => setShowReportDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-xl font-semibold transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
