'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const displayRating = hoveredRating || rating;

  return (
    <div className={cn('flex gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoveredRating(star)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          className={cn(
            interactive ? 'cursor-pointer p-0.5' : 'cursor-default p-0',
            'border-none bg-transparent'
          )}
          aria-label={interactive ? `Rate ${star} stars` : undefined}
        >
          <Star
            className={cn(
              sizeMap[size],
              'transition-colors',
              star <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        </button>
      ))}
    </div>
  );
}
