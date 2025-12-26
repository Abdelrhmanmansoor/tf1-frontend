'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { ratingService } from '@/services/rating'
import type { ReviewsResponse, ReviewData } from '@/services/rating'
import { RatingStatistics } from './RatingStatistics'
import { ReviewCard } from './ReviewCard'
import { ReviewForm } from './ReviewForm'
import { Button } from '@/components/ui/button'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProfileRatingSystemProps {
  userId: string
  userRole: 'player' | 'coach' | 'specialist' | 'club'
  currentUserId?: string
  showWriteReview?: boolean
}

export function ProfileRatingSystem({
  userId,
  userRole,
  currentUserId,
  showWriteReview = true,
}: ProfileRatingSystemProps) {
  const { language } = useLanguage()
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let response: ReviewsResponse
      const params = {
        page: currentPage,
        limit: 10,
        minRating: filterRating || undefined,
      }

      switch (userRole) {
        case 'player':
          response = await ratingService.getPlayerReviews(userId, params)
          break
        case 'coach':
          response = await ratingService.getCoachReviews(userId, params)
          break
        case 'specialist':
          response = await ratingService.getSpecialistReviews(userId, params)
          break
        case 'club':
          response = await ratingService.getClubReviews(userId, params)
          break
        default:
          throw new Error('Invalid user role')
      }

      setReviewsData(response)
    } catch (err: any) {
      console.error('Error fetching reviews:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId, userRole, currentPage, filterRating])

  const handleSubmitReview = async (reviewData: ReviewData) => {
    try {
      await ratingService.createReview(reviewData)
      setShowReviewForm(false)
      fetchReviews() // Refresh reviews
    } catch (error: any) {
      throw error
    }
  }

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await ratingService.markAsHelpful(reviewId)
      fetchReviews() // Refresh to show updated count
    } catch (error) {
      console.error('Error marking as helpful:', error)
    }
  }

  const handleMarkNotHelpful = async (reviewId: string) => {
    try {
      await ratingService.markAsNotHelpful(reviewId)
      fetchReviews() // Refresh to show updated count
    } catch (error) {
      console.error('Error marking as not helpful:', error)
    }
  }

  const handleReport = async (reviewId: string, reason: string) => {
    try {
      await ratingService.reportReview(reviewId, reason)
      alert(
        language === 'ar'
          ? 'تم إرسال البلاغ بنجاح'
          : 'Report submitted successfully'
      )
    } catch (error) {
      console.error('Error reporting review:', error)
      alert(
        language === 'ar' ? 'فشل في إرسال البلاغ' : 'Failed to submit report'
      )
    }
  }

  if (loading && !reviewsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (!reviewsData) {
    return null
  }

  const canWriteReview =
    showWriteReview && currentUserId && currentUserId !== userId

  return (
    <div className="space-y-8">
      {/* Statistics */}
      {reviewsData.statistics && (
        <RatingStatistics statistics={reviewsData.statistics} />
      )}

      {/* Filter and Write Review */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">
            {language === 'ar' ? 'تصفية:' : 'Filter:'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterRating === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  filterRating === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rating}
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {canWriteReview && (
          <Button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Star className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'اكتب تقييماً' : 'Write a Review'}
          </Button>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            revieweeId={userId}
            revieweeRole={userRole}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'التقييمات' : 'Reviews'} ({reviewsData.total})
        </h3>

        {reviewsData.data.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
            </p>
          </div>
        ) : (
          <>
            {reviewsData.data.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onMarkHelpful={handleMarkHelpful}
                onMarkNotHelpful={handleMarkNotHelpful}
                onReport={handleReport}
                currentUserId={currentUserId}
              />
            ))}
          </>
        )}

        {/* Pagination */}
        {reviewsData.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: reviewsData.pages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === reviewsData.pages ||
                    Math.abs(page - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                }
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(reviewsData.pages, p + 1))
              }
              disabled={currentPage === reviewsData.pages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
