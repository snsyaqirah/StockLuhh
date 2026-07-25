/**
 * Inventory Service
 * API endpoints for inventory operations
 * 
 * Currently uses localStorage (via useInventory hook),
 * but this is the interface for when backend is ready.
 */

import { api } from './api';
import { InventoryItem, WishlistItem, TravelKit } from '@/types';

// Inventory endpoints
export const inventoryService = {
    // Get all items
    getAll: () => api.get<InventoryItem[]>('/inventory'),

    // Get single item
    getById: (id: string) => api.get<InventoryItem>(`/inventory/${id}`),

    // Create new item
    create: (item: Omit<InventoryItem, 'id'>) =>
        api.post<InventoryItem>('/inventory', item),

    // Update item
    update: (id: string, updates: Partial<InventoryItem>) =>
        api.patch<InventoryItem>(`/inventory/${id}`, updates),

    // Delete item
    delete: (id: string) => api.delete<void>(`/inventory/${id}`),

    // Get low stock items
    getLowStock: () => api.get<InventoryItem[]>('/inventory/low-stock'),

    // Get expiring items
    getExpiring: (days: number = 30) =>
        api.get<InventoryItem[]>(`/inventory/expiring?days=${days}`),

    // Get by category
    getByCategory: (category: string) =>
        api.get<InventoryItem[]>(`/inventory/category/${category}`),
};

// Wishlist endpoints
export const wishlistService = {
    getAll: () => api.get<WishlistItem[]>('/wishlist'),

    create: (item: Omit<WishlistItem, 'id' | 'addedDate'>) =>
        api.post<WishlistItem>('/wishlist', item),

    update: (id: string, updates: Partial<WishlistItem>) =>
        api.patch<WishlistItem>(`/wishlist/${id}`, updates),

    delete: (id: string) => api.delete<void>(`/wishlist/${id}`),

    moveToInventory: (id: string) =>
        api.post<InventoryItem>(`/wishlist/${id}/move-to-inventory`, {}),
};

// Travel kits endpoints
export const travelKitService = {
    getAll: () => api.get<TravelKit[]>('/travel-kits'),

    create: (kit: Omit<TravelKit, 'id' | 'createdDate'>) =>
        api.post<TravelKit>('/travel-kits', kit),

    update: (id: string, updates: Partial<TravelKit>) =>
        api.patch<TravelKit>(`/travel-kits/${id}`, updates),

    delete: (id: string) => api.delete<void>(`/travel-kits/${id}`),

    generate: (name: string, destination?: string, tripDate?: string) =>
        api.post<TravelKit>('/travel-kits/generate', { name, destination, tripDate }),

    toggleItemPacked: (kitId: string, itemId: string) =>
        api.patch<TravelKit>(`/travel-kits/${kitId}/items/${itemId}/toggle`, {}),
};

// Analytics endpoints
export const analyticsService = {
    getSpendingByCategory: () =>
        api.get<{ category: string; amount: number }[]>('/analytics/spending'),

    getUsageStats: () =>
        api.get<{
            totalItems: number;
            totalQuantity: number;
            totalSpending: number;
            statusCounts: Record<string, number>;
        }>('/analytics/usage'),

    getMonthlySpending: (months: number = 6) =>
        api.get<{ month: string; amount: number }[]>(
            `/analytics/monthly-spending?months=${months}`
        ),
};
