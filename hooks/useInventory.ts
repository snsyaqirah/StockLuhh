'use client';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InventoryItem, ItemCategory, WishlistItem, TravelKit } from '@/types/inventory';
import { toast } from '@/hooks/use-toast';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

type UsageType = 'once' | 'half' | 'daily' | 'finished';
type UndoEntry = { action: 'update' | 'delete'; data: InventoryItem };

export function useInventory() {
  const queryClient = useQueryClient();
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);

  const itemsQuery = useQuery({
    queryKey: ['items'],
    queryFn: () => fetchJSON<InventoryItem[]>('/api/items'),
  });
  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => fetchJSON<WishlistItem[]>('/api/wishlist'),
  });
  const travelKitsQuery = useQuery({
    queryKey: ['travel-kits'],
    queryFn: () => fetchJSON<TravelKit[]>('/api/travel-kits'),
  });

  const items = useMemo(() => itemsQuery.data ?? [], [itemsQuery.data]);
  const wishlist = wishlistQuery.data ?? [];
  const travelKits = travelKitsQuery.data ?? [];

  const invalidateItems = () => queryClient.invalidateQueries({ queryKey: ['items'] });
  const invalidateWishlist = () => queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  const invalidateTravelKits = () => queryClient.invalidateQueries({ queryKey: ['travel-kits'] });

  // ---- Inventory mutations ----

  const addItemMutation = useMutation({
    mutationFn: (item: Omit<InventoryItem, 'id'>) =>
      fetchJSON<InventoryItem>('/api/items', { method: 'POST', body: JSON.stringify(item) }),
    onSuccess: (newItem) => {
      invalidateItems();
      toast({ title: 'Item added', description: `${newItem.name} has been added to your inventory.` });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InventoryItem> }) =>
      fetchJSON<InventoryItem>(`/api/items/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    onSuccess: () => {
      invalidateItems();
      toast({ title: 'Item updated', description: 'Your changes have been saved.' });
    },
  });

  const batchUpdateMutation = useMutation({
    mutationFn: (updates: { id: string; changes: Partial<InventoryItem> }[]) =>
      fetchJSON<InventoryItem[]>('/api/items/batch', { method: 'PATCH', body: JSON.stringify(updates) }),
    onSuccess: (_data, updates) => {
      invalidateItems();
      toast({ title: 'Items Updated', description: `${updates.length} items have been updated.` });
    },
  });

  const logUsageMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: UsageType }) =>
      fetchJSON<InventoryItem>(`/api/items/${id}/usage`, { method: 'POST', body: JSON.stringify({ type }) }),
    onSuccess: (_data, { type }) => {
      invalidateItems();
      const labels: Record<UsageType, string> = {
        once: 'Used once',
        half: 'Used half',
        daily: 'Logged daily use',
        finished: 'Marked finished',
      };
      toast({ title: labels[type], description: 'Usage recorded ✓' });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => fetchJSON<{ success: true }>(`/api/items/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      invalidateItems();
      toast({ title: 'Item deleted', description: 'The item has been removed from your inventory.' });
    },
  });

  const addItem = useCallback(
    (item: Omit<InventoryItem, 'id'>) => addItemMutation.mutate(item),
    [addItemMutation]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<InventoryItem>) => {
      const oldItem = items.find((i) => i.id === id);
      if (oldItem) setUndoStack((s) => [...s.slice(-9), { action: 'update', data: oldItem }]);
      updateItemMutation.mutate({ id, updates });
    },
    [items, updateItemMutation]
  );

  const batchUpdateItems = useCallback(
    (updates: { id: string; changes: Partial<InventoryItem> }[]) => batchUpdateMutation.mutate(updates),
    [batchUpdateMutation]
  );

  const logUsage = useCallback(
    (id: string, type: UsageType) => logUsageMutation.mutate({ id, type }),
    [logUsageMutation]
  );

  const deleteItem = useCallback(
    (id: string) => {
      const oldItem = items.find((i) => i.id === id);
      if (oldItem) setUndoStack((s) => [...s.slice(-9), { action: 'delete', data: oldItem }]);
      deleteItemMutation.mutate(id);
    },
    [items, deleteItemMutation]
  );

  const undoLastAction = useCallback(() => {
    const last = undoStack[undoStack.length - 1];
    if (!last) return;

    if (last.action === 'delete') {
      const { id, ...rest } = last.data;
      addItemMutation.mutate(rest, {
        onSuccess: () => toast({ title: 'Undo successful', description: 'The item has been restored.' }),
      });
    } else if (last.action === 'update') {
      const { id, ...rest } = last.data;
      updateItemMutation.mutate(
        { id, updates: rest },
        { onSuccess: () => toast({ title: 'Undo successful', description: 'Your changes have been reverted.' }) }
      );
    }
    setUndoStack((s) => s.slice(0, -1));
  }, [undoStack, addItemMutation, updateItemMutation]);

  // ---- Wishlist mutations ----

  const addToWishlistMutation = useMutation({
    mutationFn: (item: Omit<WishlistItem, 'id' | 'addedDate'>) =>
      fetchJSON<WishlistItem>('/api/wishlist', { method: 'POST', body: JSON.stringify(item) }),
    onSuccess: (newItem) => {
      invalidateWishlist();
      toast({ title: 'Added to wishlist', description: `${newItem.name} has been added to your wishlist.` });
    },
  });

  const updateWishlistItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<WishlistItem> }) =>
      fetchJSON<WishlistItem>(`/api/wishlist/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    onSuccess: () => invalidateWishlist(),
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: string) => fetchJSON<{ success: true }>(`/api/wishlist/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      invalidateWishlist();
      toast({ title: 'Removed from wishlist', description: 'The item has been removed from your wishlist.' });
    },
  });

  const moveWishlistToInventoryMutation = useMutation({
    mutationFn: (id: string) => fetchJSON<InventoryItem>(`/api/wishlist/${id}/purchase`, { method: 'POST' }),
    onSuccess: (newItem) => {
      invalidateItems();
      invalidateWishlist();
      toast({ title: 'Moved to inventory', description: `${newItem.name} has been added to your inventory.` });
    },
  });

  const addToWishlist = useCallback(
    (item: Omit<WishlistItem, 'id' | 'addedDate'>) => addToWishlistMutation.mutate(item),
    [addToWishlistMutation]
  );
  const updateWishlistItem = useCallback(
    (id: string, updates: Partial<WishlistItem>) => updateWishlistItemMutation.mutate({ id, updates }),
    [updateWishlistItemMutation]
  );
  const removeFromWishlist = useCallback(
    (id: string) => removeFromWishlistMutation.mutate(id),
    [removeFromWishlistMutation]
  );
  const moveWishlistToInventory = useCallback(
    (wishlistItem: WishlistItem) => moveWishlistToInventoryMutation.mutate(wishlistItem.id),
    [moveWishlistToInventoryMutation]
  );

  // ---- Travel kit mutations ----

  const createTravelKitMutation = useMutation({
    mutationFn: (kit: Omit<TravelKit, 'id' | 'createdDate'>) =>
      fetchJSON<TravelKit>('/api/travel-kits', { method: 'POST', body: JSON.stringify(kit) }),
    onSuccess: (newKit) => {
      invalidateTravelKits();
      toast({ title: 'Travel kit created', description: `${newKit.name} is ready for packing.` });
    },
  });

  const generateTravelKitMutation = useMutation({
    mutationFn: (payload: { name: string; destination?: string; tripDate?: string }) =>
      fetchJSON<TravelKit>('/api/travel-kits/generate', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (newKit) => {
      invalidateTravelKits();
      toast({ title: 'Travel kit created', description: `${newKit.name} is ready for packing.` });
    },
  });

  const updateTravelKitMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TravelKit> }) =>
      fetchJSON<TravelKit>(`/api/travel-kits/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
    onSuccess: () => invalidateTravelKits(),
  });

  const deleteTravelKitMutation = useMutation({
    mutationFn: (id: string) => fetchJSON<{ success: true }>(`/api/travel-kits/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      invalidateTravelKits();
      toast({ title: 'Travel kit deleted', description: 'The travel kit has been removed.' });
    },
  });

  const toggleTravelItemPackedMutation = useMutation({
    mutationFn: ({ kitId, itemId }: { kitId: string; itemId: string }) =>
      fetchJSON<TravelKit>(`/api/travel-kits/${kitId}/items/${itemId}/toggle`, { method: 'PATCH' }),
    onSuccess: () => invalidateTravelKits(),
  });

  const createTravelKit = useCallback(
    (kit: Omit<TravelKit, 'id' | 'createdDate'>) => createTravelKitMutation.mutate(kit),
    [createTravelKitMutation]
  );
  const updateTravelKit = useCallback(
    (id: string, updates: Partial<TravelKit>) => updateTravelKitMutation.mutate({ id, updates }),
    [updateTravelKitMutation]
  );
  const deleteTravelKit = useCallback(
    (id: string) => deleteTravelKitMutation.mutate(id),
    [deleteTravelKitMutation]
  );
  const toggleTravelItemPacked = useCallback(
    (kitId: string, itemId: string) => toggleTravelItemPackedMutation.mutate({ kitId, itemId }),
    [toggleTravelItemPackedMutation]
  );
  const generateTravelKit = useCallback(
    (name: string, destination?: string, tripDate?: string) =>
      generateTravelKitMutation.mutate({ name, destination, tripDate }),
    [generateTravelKitMutation]
  );

  // ---- Derived / computed data (mirrors the original client-side selectors) ----

  const getItemsByCategory = useCallback(
    (category: ItemCategory | 'all') => {
      if (category === 'all') return items;
      return items.filter((item) => item.category === category);
    },
    [items]
  );

  const lowStockItems = useMemo(
    () => items.filter((item) => item.status === 'low' || item.status === 'finished'),
    [items]
  );

  const expiringItems = useMemo(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return items
      .filter((item) => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        return expiry <= thirtyDaysLater && expiry >= today;
      })
      .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime());
  }, [items]);

  const expiredItems = useMemo(() => {
    const today = new Date();
    return items.filter((item) => {
      if (!item.expiryDate) return false;
      return new Date(item.expiryDate) < today;
    });
  }, [items]);

  const travelEssentials = useMemo(() => items.filter((item) => item.isTravelEssential), [items]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalSpending = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const statusCounts = {
      new: items.filter((i) => i.status === 'new').length,
      'in-use': items.filter((i) => i.status === 'in-use').length,
      low: items.filter((i) => i.status === 'low').length,
      finished: items.filter((i) => i.status === 'finished').length,
    };
    return { totalItems, totalQuantity, totalSpending, statusCounts };
  }, [items]);

  const spendingByCategory = useMemo(() => {
    const spending: Record<string, number> = {};
    items.forEach((item) => {
      if (item.price) {
        spending[item.category] = (spending[item.category] || 0) + item.price * item.quantity;
      }
    });
    return Object.entries(spending).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));
  }, [items]);

  return {
    // Inventory
    items,
    isLoading: itemsQuery.isLoading || wishlistQuery.isLoading || travelKitsQuery.isLoading,
    addItem,
    updateItem,
    batchUpdateItems,
    deleteItem,
    logUsage,
    getItemsByCategory,
    lowStockItems,
    expiringItems,
    expiredItems,
    travelEssentials,
    stats,
    spendingByCategory,
    undoLastAction,
    canUndo: undoStack.length > 0,

    // Wishlist
    wishlist,
    addToWishlist,
    updateWishlistItem,
    removeFromWishlist,
    moveWishlistToInventory,

    // Travel Kits
    travelKits,
    createTravelKit,
    updateTravelKit,
    deleteTravelKit,
    toggleTravelItemPacked,
    generateTravelKit,
  };
}
