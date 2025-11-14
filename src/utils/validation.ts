import type { FeedbackRequest, FieldError } from '../types/feedback';

export function validateMemberId(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Member ID is required';
  }
  if (value.length > 36) {
    return 'Member ID must be less than 36 characters';
  }
  return null;
}

export function validateProviderName(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Provider name is required';
  }
  if (value.length > 80) {
    return 'Provider name must be less than 80 characters';
  }
  return null;
}

export function validateRating(value: number | null | undefined): string | null {
  if (value === null || value === undefined) {
    return 'Rating is required';
  }
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return 'Rating must be between 1 and 5';
  }
  return null;
}

export function validateComment(value: string | undefined): string | null {
  if (value && value.length > 200) {
    return 'Comment must be less than 200 characters';
  }
  return null;
}

export function validateFeedbackRequest(request: FeedbackRequest): FieldError[] {
  const errors: FieldError[] = [];

  const memberIdError = validateMemberId(request.memberId);
  if (memberIdError) {
    errors.push({ field: 'memberId', message: memberIdError });
  }

  const providerNameError = validateProviderName(request.providerName);
  if (providerNameError) {
    errors.push({ field: 'providerName', message: providerNameError });
  }

  const ratingError = validateRating(request.rating);
  if (ratingError) {
    errors.push({ field: 'rating', message: ratingError });
  }

  const commentError = validateComment(request.comment);
  if (commentError) {
    errors.push({ field: 'comment', message: commentError });
  }

  return errors;
}