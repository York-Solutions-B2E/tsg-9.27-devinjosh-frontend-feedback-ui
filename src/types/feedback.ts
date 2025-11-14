// Request/Response types matching backend DTOs

export interface FeedbackRequest {
    memberId: string;
    providerName: string;
    rating: number;
    comment?: string;
}

export interface FeedbackResponse {
    id: string;
    memberId: string;
    providerName: string;
    rating: number;
    comment: string | null;
    submittedAt: string;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface ErrorResponse {
    errors: FieldError[];
}

export interface ApiError {
    status: number;
    data: ErrorResponse | { message?: string };
}