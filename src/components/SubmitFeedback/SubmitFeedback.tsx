import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactStars from "react-stars";
import { feedbackService } from "../../services/feedbackService";
import { validateFeedbackRequest } from "../../utils/validation";
import type { FeedbackRequest, FieldError, ApiError } from "../../types/feedback";
import { ApiError as ApiErrorClass } from '../../services/api';


export function SubmitFeedback() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FeedbackRequest>({
      memberId: '',
      providerName: '',
      rating: 0,
      comment: '',
    });
    const [ errors, setErrors ] = useState<FieldError[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ submitError, setSubmitError ] = useState<String | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev: FeedbackRequest) => ({
        ...prev,
        [name]: name === 'rating' ? parseInt(value, 10) || 0 : value,
      }));
      // Clear field error when user starts typing
      setErrors(prev => prev.filter(err => err.field !== name));
      setSubmitError(null);
    }

    const handleRatingChange = (newRating: number) => {
      setFormData((prev: FeedbackRequest) => ({ ...prev, rating: newRating }));
      setErrors(prev => prev.filter(err => err.field !== 'rating'));
      setSubmitError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      setErrors([]);
  
      // Client-side validation
      const validationErrors = validateFeedbackRequest(formData);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setIsSubmitting(true);
      try {
        await feedbackService.submitFeedback(formData);
        // Success - navigate to MyFeedback with the memberId
        navigate(`/my-feedback?memberId=${encodeURIComponent(formData.memberId)}`);
      } catch (error) {
        if (error instanceof ApiErrorClass) {
          const apiError = error as ApiError;
          if (apiError.status === 0) {
            // Network error (connection refused, etc.)
            setSubmitError(apiError.data && typeof apiError.data === 'object' && 'message' in apiError.data 
              ? String(apiError.data.message) 
              : 'Unable to connect to the server. Please ensure the backend API is running on port 8082.');
          } else if (apiError.data && 'errors' in apiError.data && Array.isArray(apiError.data.errors)) {
            // Server validation errors
            setErrors(apiError.data.errors);
          } else {
            const errorMessage = 'message' in apiError.data ? apiError.data.message : undefined;
            setSubmitError(errorMessage || `Error: ${apiError.status}`);
          }
        } else {
          setSubmitError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    const getFieldError = (fieldName: string): string | undefined => {
      return errors.find(err => err.field === fieldName)?.message;
    };

    if (isSubmitting) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center py-8">Submitting feedback...</div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Submit Feedback
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Member ID */}
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Member ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="memberId"
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              maxLength={36}
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors ${
                getFieldError('memberId') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              aria-invalid={!!getFieldError('memberId')}
              aria-describedby={getFieldError('memberId') ? 'memberId-error' : undefined}
            />
            {getFieldError('memberId') && (
              <p id="memberId-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {getFieldError('memberId')}
              </p>
            )}
          </div>
          {/* Provider Name */}
          <div>
            <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Provider Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="providerName"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              maxLength={80}
              required
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors ${
                getFieldError('providerName') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              aria-invalid={!!getFieldError('providerName')}
              aria-describedby={getFieldError('providerName') ? 'providerName-error' : undefined}
            />
            {getFieldError('providerName') && (
              <p id="providerName-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {getFieldError('providerName')}
              </p>
            )}
          </div>
          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <ReactStars
                count={5}
                value={formData.rating}
                onChange={handleRatingChange}
                size={40}
                color2={'#fbbf24'} // gold/yellow for filled stars
                color1={'#d1d5db'} // gray for empty stars
                half={false}
                edit={!isSubmitting}
              />
              {formData.rating > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({formData.rating} {formData.rating === 1 ? 'star' : 'stars'})
                </span>
              )}
            </div>
            {getFieldError('rating') && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {getFieldError('rating')}
              </p>
            )}
          </div>
          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Comment (optional)
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              placeholder="Share your feedback..."
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors ${
                getFieldError('comment') ? 'border-red-500' : 'border-gray-300'
              } disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
              aria-invalid={!!getFieldError('comment')}
              aria-describedby={getFieldError('comment') ? 'comment-error' : 'comment-counter'}
            />
            <div className="mt-1 flex justify-between">
              {getFieldError('comment') ? (
                <p id="comment-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
                  {getFieldError('comment')}
                </p>
              ) : (
                <div></div>
              )}
              <div id="comment-counter" className="text-sm text-gray-500 dark:text-gray-400 text-right">
                {formData.comment?.length || 0} / 200 characters
              </div>
            </div>
          </div>

          {/* General Error Display */}
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-800 dark:text-red-200">{submitError}</p>
                <button
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                  aria-label="Dismiss error"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/my-feedback')}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }