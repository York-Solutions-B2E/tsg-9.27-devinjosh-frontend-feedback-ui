import { useState } from 'react';
import { FeedbackCard } from './FeedbackCard';
import { feedbackService } from '../../services/feedbackService';
import type { FeedbackResponse } from '../../types/feedback';

type SearchMode = 'memberId' | 'feedbackId';

export function MyFeedback() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('memberId');
  const [results, setResults] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a value to search.');
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: FeedbackResponse[];

      if (mode === 'memberId') {
        // GET /feedback?memberId={memberId}
        data = await feedbackService.getFeedbackByMemberId(trimmed);
      } else {
        // GET /feedback/{id}
        const item = await feedbackService.getFeedbackById(trimmed);
        data = [item]; // wrap single result so we can map over it
      }

      setResults(data);
    } catch (err) {
      console.error('Failed to fetch feedback', err);
      setError('Could not load feedback. Please check your ID and try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        My Feedback
      </h1>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search value
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'memberId'
                ? 'Enter member ID (e.g. m-101)'
                : 'Enter feedback ID (UUID)'
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Toggle search mode */}
        <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Search by</span>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="searchMode"
                value="memberId"
                checked={mode === 'memberId'}
                onChange={() => setMode('memberId')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Member ID</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="searchMode"
                value="feedbackId"
                checked={mode === 'feedbackId'}
                onChange={() => setMode('feedbackId')}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Feedback ID</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Results */}
      {results.length === 0 && !loading && !error && (
        <p className="text-gray-600 dark:text-gray-400">
          No feedback loaded. Try searching by Member ID or Feedback ID.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((fb) => (
            <FeedbackCard key={fb.id} {...fb} />
          ))}
        </div>
      )}
    </div>
  );
}

