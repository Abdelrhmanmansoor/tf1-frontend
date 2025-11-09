'use client'

import { StarRating } from './StarRating'
import { useLanguage } from '@/contexts/language-context'

interface RatingDisplayProps {
  averageRating: number
  totalReviews: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showReviewCount?: boolean
  className?: string
}

export function RatingDisplay({
  averageRating,
  totalReviews,
  size = 'md',
  showReviewCount = true,
  className = '',
}: RatingDisplayProps) {
  const { language } = useLanguage()

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <StarRating rating={averageRating} size={size} showNumber />
      {showReviewCount && totalReviews > 0 && (
        <span className={`${textSizeClasses[size]} text-gray-500`}>
          ({totalReviews} {language === 'ar' ? 'تقييم' : 'reviews'})
        </span>
      )}
    </div>
  )
}
