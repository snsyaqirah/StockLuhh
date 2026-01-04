/**
 * API Client Configuration
 * Base setup for backend API calls (currently returns mock data)
 * 
 * When your friend sets up the backend, just update the endpoints here!
 */

import { API_CONFIG } from '@/lib/constants';

// API Error type
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// Generic API response wrapper
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    error?: ApiError;
}

/**
 * Base fetch wrapper with error handling
 * Currently not used (using localStorage), but ready for backend
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw {
                message: errorData.message || `HTTP error ${response.status}`,
                code: errorData.code,
                status: response.status,
            } as ApiError;
        }

        const data = await response.json();
        return { data, success: true };
    } catch (error) {
        if ((error as ApiError).status) {
            return { data: null as T, success: false, error: error as ApiError };
        }

        return {
            data: null as T,
            success: false,
            error: {
                message: error instanceof Error ? error.message : 'Network error',
                code: 'NETWORK_ERROR',
            },
        };
    }
}

// Helper methods for common HTTP methods
export const api = {
    get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: unknown) =>
        apiFetch<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown) =>
        apiFetch<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    patch: <T>(endpoint: string, body: unknown) =>
        apiFetch<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};
