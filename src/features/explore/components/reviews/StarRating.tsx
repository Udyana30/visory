import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  onRate?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  max = 5, 
  onRate, 
  size = 16,
  interactive = false 
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const value = index + 1;
        const isFilled = value <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(value)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              size={size}
              className={`${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-gray-100 text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};