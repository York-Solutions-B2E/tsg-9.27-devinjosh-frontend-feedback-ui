import ReactStars from 'react-stars';
import { formatDate } from '../../utils/dateUtils';
import type { FeedbackResponse } from '../../types/feedback';

export function FeedbackCard({
  memberId,
  providerName,
  rating,
  comment,
  submittedAt,
}: FeedbackResponse) {
  const submittedDate = formatDate(submittedAt);

  return (
    <article className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      {/* Header: Provider + date */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {providerName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Submitted on {submittedDate}
          </p>
        </div>

        {/* Member badge */}
        <div className="inline-flex items-center self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          Member ID: <span className="ml-1 font-semibold">{memberId}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-2">
        <ReactStars
          count={5}
          value={rating}
          edit={false}
          size={20}
          color1="#e5e7eb"      // Tailwind gray-200-ish for empty stars
          color2="#fbbf24" // Tailwind amber-400-ish for filled stars
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}/5
        </span>
      </div>

      {/* Comment */}
      {comment && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          {comment}
        </p>
      )}
      {!comment && (
        <p className="mt-4 text-sm italic text-gray-400 dark:text-gray-500">
          No comment provided.
        </p>
      )}
    </article>
  );
}
