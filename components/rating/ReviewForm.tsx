'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { ReviewData } from '@/services/rating'

interface ReviewFormProps {
  revieweeId: string
  revieweeRole: 'player' | 'coach' | 'specialist' | 'club'
  onSubmit: (data: ReviewData) => Promise<void>
  onCancel: () => void
}

export function ReviewForm({
  revieweeId,
  revieweeRole,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const { language } = useLanguage()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ReviewData>({
    revieweeId,
    revieweeRole,
    rating: 5,
    title: '',
    comment: '',
    commentAr: '',
    detailedRatings: {
      professionalism: 5,
      communication: 5,
      expertise: 5,
      punctuality: 5,
      valueForMoney: 5,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.comment.trim()) {
      alert(language === 'ar' ? 'يرجى كتابة التقييم' : 'Please write a review')
      return
    }

    try {
      setSubmitting(true)
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(
        language === 'ar' ? 'فشل في إرسال التقييم' : 'Failed to submit review'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const detailedRatingLabels = {
    professionalism: language === 'ar' ? 'الاحترافية' : 'Professionalism',
    communication: language === 'ar' ? 'التواصل' : 'Communication',
    expertise: language === 'ar' ? 'الخبرة' : 'Expertise',
    punctuality: language === 'ar' ? 'الالتزام بالمواعيد' : 'Punctuality',
    value: language === 'ar' ? 'القيمة' : 'Value',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {language === 'ar' ? 'اكتب تقييمك' : 'Write Your Review'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {language === 'ar' ? 'التقييم العام' : 'Overall Rating'} *
          </label>
          <StarRating
            rating={formData.rating}
            size="xl"
            interactive
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {language === 'ar' ? 'العنوان (اختياري)' : 'Title (optional)'}
          </label>
          <input
            type="text"
            maxLength={200}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder={
              language === 'ar'
                ? 'لخص تجربتك...'
                : 'Summarize your experience...'
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {language === 'ar' ? 'التقييم' : 'Review'} *
          </label>
          <textarea
            required
            maxLength={2000}
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            placeholder={
              language === 'ar' ? 'شارك تجربتك...' : 'Share your experience...'
            }
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/2000{' '}
            {language === 'ar' ? 'حرف' : 'characters'}
          </p>
        </div>

        {/* Arabic Review (optional) */}
        {language === 'en' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Arabic Review (optional)
            </label>
            <textarea
              maxLength={2000}
              value={formData.commentAr}
              onChange={(e) =>
                setFormData({ ...formData, commentAr: e.target.value })
              }
              placeholder="التقييم بالعربية..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              dir="rtl"
            />
          </div>
        )}

        {/* Detailed Ratings */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            {language === 'ar'
              ? 'التقييمات التفصيلية (اختياري)'
              : 'Detailed Ratings (optional)'}
          </label>
          <div className="space-y-4">
            {Object.entries(formData.detailedRatings!).map(
              ([category, rating]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {
                      detailedRatingLabels[
                        category as keyof typeof detailedRatingLabels
                      ]
                    }
                  </span>
                  <StarRating
                    rating={rating}
                    size="md"
                    interactive
                    onChange={(newRating) =>
                      setFormData({
                        ...formData,
                        detailedRatings: {
                          ...formData.detailedRatings!,
                          [category]: newRating,
                        },
                      })
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
          >
            {submitting
              ? language === 'ar'
                ? 'جاري الإرسال...'
                : 'Submitting...'
              : language === 'ar'
                ? 'إرسال التقييم'
                : 'Submit Review'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1 py-3 rounded-xl font-semibold"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
