'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showNumber?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }

  const handleClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => {
          const filled = star <= Math.round(rating)
          const partial = star === Math.ceil(rating) && rating % 1 !== 0

          return (
            <motion.button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              disabled={!interactive}
              whileHover={interactive ? { scale: 1.2 } : {}}
              whileTap={interactive ? { scale: 0.9 } : {}}
              className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : partial
                      ? 'fill-yellow-200 text-yellow-400'
                      : 'fill-none text-gray-300'
                }`}
              />
            </motion.button>
          )
        })}
      </div>
      {showNumber && (
        <span
          className={`${textSizeClasses[size]} font-semibold text-gray-700`}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
