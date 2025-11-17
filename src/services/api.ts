const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1';

export class ApiError extends Error {
    public status: number;
    public data: unknown;

    constructor(
        status: number,
        data: unknown,
        message?: string
    ) {
        super(message || `API Error: ${status}`);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        // Check if it's the ErrorResponse format with 'errors' array
        if (errorData && errorData.errors && Array.isArray(errorData.errors)) {
          // This is a validation error (400)
          throw new ApiError(response.status, errorData);
        }
      } catch (e) {
        // If parsing fails or already thrown ApiError
        if (e instanceof ApiError) throw e;
        errorData = { message: response.statusText };
      }
      throw new ApiError(response.status, errorData);
    }
  
    if (response.status === 204) {
      return {} as T;
    }
  
    return response.json();
}

export const apiClient = {
    async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            return handleResponse<T>(response);
        } catch (error) {
            // Handle network errors (connection refused, timeout, etc.)
            if (error instanceof TypeError) {
                // Network errors typically throw TypeError with messages like:
                // "Failed to fetch", "NetworkError", "ERR_CONNECTION_REFUSED", etc.
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('fetch') || 
                    errorMessage.includes('network') || 
                    errorMessage.includes('connection') ||
                    errorMessage.includes('failed')) {
                    throw new ApiError(0, { 
                        message: 'Unable to connect to the server. Please ensure the backend API is running on port 8082.' 
                    }, 'Network Error');
                }
            }
            throw error;
        }
    },

    async post<T>(endpoint: string, data: unknown): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse<T>(response);
        } catch (error) {
            // Handle network errors (connection refused, timeout, etc.)
            if (error instanceof TypeError) {
                // Network errors typically throw TypeError with messages like:
                // "Failed to fetch", "NetworkError", "ERR_CONNECTION_REFUSED", etc.
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('fetch') || 
                    errorMessage.includes('network') || 
                    errorMessage.includes('connection') ||
                    errorMessage.includes('failed')) {
                    throw new ApiError(0, { 
                        message: 'Unable to connect to the server. Please ensure the backend API is running on port 8082.' 
                    }, 'Network Error');
                }
            }
            throw error;
        }
    },
};