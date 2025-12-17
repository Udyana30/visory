import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { CreateReviewRequest } from '../../types/api';

interface ReviewFormProps {
  onSubmit: (data: CreateReviewRequest) => Promise<void>;
  isSubmitting: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    await onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <StarRating 
          rating={rating} 
          size={24} 
          interactive 
          onRate={setRating} 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about this comic..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] resize-y bg-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
};