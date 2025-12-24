import { useState, useCallback, useMemo } from 'react';
import { InventoryItem, ItemCategory } from '@/types/inventory';
import { mockInventory } from '@/data/mockData';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

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
    
    return items.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= thirtyDaysLater && expiry >= today;
    });
  }, [items]);

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
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    lowStockItems,
    expiringItems,
    stats,
    spendingByCategory,
  };
}
