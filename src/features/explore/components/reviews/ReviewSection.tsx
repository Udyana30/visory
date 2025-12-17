import React, { useEffect, useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { galleryService } from '../../services/galleryService';
import { ComicReview } from '../../types/domain';
import { CreateReviewRequest } from '../../types/api';
import { ReviewForm } from './ReviewForm';
import { StarRating } from './StarRating';

interface ReviewSectionProps {
  comicId: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ comicId }) => {
  const [reviews, setReviews] = useState<ComicReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await galleryService.getReviews(comicId);
      setReviews(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [comicId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreateReview = async (data: CreateReviewRequest) => {
    try {
      setIsSubmitting(true);
      await galleryService.createReview(comicId, data);
      await fetchReviews();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 pt-10 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Reviews <span className="text-gray-400 font-normal">({reviews.length})</span>
      </h2>

      <ReviewForm onSubmit={handleCreateReview} isSubmitting={isSubmitting} />

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
            No reviews yet. Be the first to review!
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">User {review.userId}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};