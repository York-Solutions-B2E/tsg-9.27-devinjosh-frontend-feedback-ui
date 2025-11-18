import { apiClient } from './api';
import type { FeedbackRequest, FeedbackResponse } from '../types/feedback';

export interface IFeedbackService {
    submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse>;
    getFeedbackById(id: string): Promise<FeedbackResponse>;
    getFeedbackByMemberId(memberId: string): Promise<FeedbackResponse[]>;
}

class FeedbackService implements IFeedbackService {
    async submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
        // POST /api/v1/feedback
        // Returns 201 Created with FeedbackResponse
        return apiClient.post<FeedbackResponse>('/feedback', request);
    }

    async getFeedbackById(id: string): Promise<FeedbackResponse> {
        // GET /api/v1/feedback/{id}
        // Returns 200 OK with FeedbackResponse
        return apiClient.get<FeedbackResponse>(`/feedback/${id}`);
    }

    async getFeedbackByMemberId(memberId: string): Promise<FeedbackResponse[]> {
        // GET /api/v1/feedback?memberId={memberId}
        // Returns 200 OK with array of FeedbackResponse
        // Properly encode the memberId to handle special characters
        const encodedMemberId = encodeURIComponent(memberId);
        return apiClient.get<FeedbackResponse[]>(`/feedback?memberId=${encodedMemberId}`);
    }
}

// Export instance
export const feedbackService = new FeedbackService();