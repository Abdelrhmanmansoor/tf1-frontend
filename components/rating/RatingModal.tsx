'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { ratingService } from '@/services/rating'
import type { ReviewData } from '@/services/rating'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userRole: 'player' | 'coach' | 'specialist' | 'club'
  userName: string
  onSuccess?: () => void
}

export function RatingModal({
  isOpen,
  onClose,
  userId,
  userRole,
  userName,
  onSuccess,
}: RatingModalProps) {
  const { language } = useLanguage()
  const [rating, setRating] = useState(5)
  // const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [titleAr, setTitleAr] = useState('')
  const [comment, setComment] = useState('')
  const [commentAr, setCommentAr] = useState('')
  const [showDetailedRatings, setShowDetailedRatings] = useState(false)
  const [detailedRatings, setDetailedRatings] = useState({
    professionalism: 5,
    communication: 5,
    expertise: 5,
    punctuality: 5,
    valueForMoney: 5,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setError(
        language === 'ar' ? 'الرجاء كتابة تعليق' : 'Please write a comment'
      )
      return
    }

    try {
      setLoading(true)
      setError(null)

      const reviewData: ReviewData = {
        revieweeId: userId,
        revieweeRole: userRole,
        rating,
        comment: comment.trim(),
      }

      if (title.trim()) {
        reviewData.title = title.trim()
      }

      if (titleAr.trim()) {
        reviewData.titleAr = titleAr.trim()
      }

      if (commentAr.trim()) {
        reviewData.commentAr = commentAr.trim()
      }

      if (showDetailedRatings) {
        reviewData.detailedRatings = detailedRatings
      }

      await ratingService.createReview(reviewData)

      onSuccess?.()
      onClose()

      // Reset form
      setRating(5)
      setTitle('')
      setTitleAr('')
      setComment('')
      setCommentAr('')
      setShowDetailedRatings(false)
      setDetailedRatings({
        professionalism: 5,
        communication: 5,
        expertise: 5,
        punctuality: 5,
        valueForMoney: 5,
      })
    } catch (err: any) {
      setError(
        err.message ||
          (language === 'ar'
            ? 'فشل في إرسال التقييم'
            : 'Failed to submit review')
      )
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number
    onChange: (_val: number) => void
  }) => {
    const [hover, setHover] = useState(0)

    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hover || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const DetailedRatingRow = ({
    label,
    labelAr,
    value,
    onChange,
  }: {
    label: string
    labelAr: string
    value: number
    onChange: (_val: number) => void
  }) => {
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <span className="text-sm font-medium text-gray-700">
          {language === 'ar' ? labelAr : label}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {language === 'ar' ? 'تقييم' : 'Rate'} {userName}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {language === 'ar'
                        ? 'شارك تجربتك مع الآخرين'
                        : 'Share your experience with others'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Overall Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'ar' ? 'التقييم العام' : 'Overall Rating'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating value={rating} onChange={setRating} />
                    <span className="text-2xl font-bold text-gray-900">
                      {rating}.0
                    </span>
                  </div>
                </div>

                {/* Title (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar'
                      ? 'العنوان (اختياري)'
                      : 'Title (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'مثال: لاعب رائع!'
                        : 'e.g., Great player!'
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Title Arabic (Optional) */}
                {language !== 'ar' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      placeholder="مثال: لاعب رائع!"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir="rtl"
                    />
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'التعليق' : 'Comment'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'شارك تجربتك التفصيلية...'
                        : 'Share your detailed experience...'
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Comment Arabic (Optional) */}
                {language !== 'ar' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Comment (Optional)
                    </label>
                    <textarea
                      value={commentAr}
                      onChange={(e) => setCommentAr(e.target.value)}
                      placeholder="شارك تجربتك التفصيلية..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      dir="rtl"
                    />
                  </div>
                )}

                {/* Detailed Ratings Toggle */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDetailedRatings(!showDetailedRatings)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    {showDetailedRatings
                      ? language === 'ar'
                        ? '- إخفاء التقييمات التفصيلية'
                        : '- Hide Detailed Ratings'
                      : language === 'ar'
                        ? '+ إضافة تقييمات تفصيلية (اختياري)'
                        : '+ Add Detailed Ratings (Optional)'}
                  </button>

                  {showDetailedRatings && (
                    <div className="mt-4 space-y-1 bg-gray-50 p-4 rounded-lg">
                      <DetailedRatingRow
                        label="Professionalism"
                        labelAr="الاحترافية"
                        value={detailedRatings.professionalism}
                        onChange={(val) =>
                          setDetailedRatings({
                            ...detailedRatings,
                            professionalism: val,
                          })
                        }
                      />
                      <DetailedRatingRow
                        label="Communication"
                        labelAr="التواصل"
                        value={detailedRatings.communication}
                        onChange={(val) =>
                          setDetailedRatings({
                            ...detailedRatings,
                            communication: val,
                          })
                        }
                      />
                      <DetailedRatingRow
                        label="Expertise"
                        labelAr="الخبرة"
                        value={detailedRatings.expertise}
                        onChange={(val) =>
                          setDetailedRatings({
                            ...detailedRatings,
                            expertise: val,
                          })
                        }
                      />
                      <DetailedRatingRow
                        label="Punctuality"
                        labelAr="الالتزام بالمواعيد"
                        value={detailedRatings.punctuality}
                        onChange={(val) =>
                          setDetailedRatings({
                            ...detailedRatings,
                            punctuality: val,
                          })
                        }
                      />
                      <DetailedRatingRow
                        label="Value for Money"
                        labelAr="القيمة مقابل المال"
                        value={detailedRatings.valueForMoney}
                        onChange={(val) =>
                          setDetailedRatings({
                            ...detailedRatings,
                            valueForMoney: val,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !comment.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? language === 'ar'
                      ? 'جاري الإرسال...'
                      : 'Submitting...'
                    : language === 'ar'
                      ? 'إرسال التقييم'
                      : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
