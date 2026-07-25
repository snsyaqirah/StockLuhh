import { useState, useCallback, useMemo, useEffect } from 'react';
import { InventoryItem, ItemCategory, WishlistItem, TravelKit, TravelKitItem } from '@/types/inventory';
import { mockInventory, mockWishlist, mockTravelKits } from '@/data/mockData';
import { useLocalStorage } from './useLocalStorage';
import { toast } from '@/hooks/use-toast';

export function useInventory() {
  const [items, setItems] = useLocalStorage<InventoryItem[]>('stockluhh-inventory', mockInventory);
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('stockluhh-wishlist', mockWishlist);
  const [travelKits, setTravelKits] = useLocalStorage<TravelKit[]>('stockluhh-travel-kits', mockTravelKits);
  const [undoStack, setUndoStack] = useState<{ action: string; data: InventoryItem | WishlistItem }[]>([]);

  // Inventory CRUD
  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [newItem, ...prev]);
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your inventory.`,
    });
  }, [setItems]);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems((prev) => {
      const oldItem = prev.find((item) => item.id === id);
      if (oldItem) {
        setUndoStack((stack) => [...stack.slice(-9), { action: 'update', data: oldItem }]);
      }
      return prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
    });
    toast({
      title: "Item updated",
      description: "Your changes have been saved.",
    });
  }, [setItems]);

  const batchUpdateItems = useCallback((updates: { id: string, changes: Partial<InventoryItem> }[]) => {
    setItems((prev) =>
      prev.map((item) => {
        const update = updates.find((u) => u.id === item.id);
        return update ? { ...item, ...update.changes } : item;
      })
    );
    toast({
      title: "Items Updated",
      description: `${updates.length} items have been updated.`,
    });
  }, [setItems]);

  // One-tap usage logging
  const logUsage = useCallback((id: string, type: 'once' | 'half' | 'daily' | 'finished') => {
    setItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;

      const now = new Date().toISOString();
      const usageRecord = { id: Date.now().toString(), action: type, date: now, quantityUsed: type === 'half' ? 0.5 : 1 };
      const newHistory = [...(item.usageHistory || []), usageRecord] as typeof item.usageHistory;

      // Calculate new quantity
      let newQuantity = item.quantity;
      let newStatus = item.status;

      if (type === 'finished') {
        newQuantity = 0;
        newStatus = 'finished';
      } else if (type === 'half') {
        newQuantity = Math.max(0, item.quantity - 0.5);
        if (newQuantity <= item.minQuantity) newStatus = 'low';
      } else if (type === 'once') {
        newQuantity = Math.max(0, item.quantity - 1);
        if (newQuantity === 0) newStatus = 'finished';
        else if (newQuantity <= item.minQuantity) newStatus = 'low';
      }
      // 'daily' just logs without changing quantity

      // Calculate average lifespan from usage history
      let avgLifespan = item.averageLifespanDays;
      if (newHistory.length >= 2 && item.openedDate) {
        const opened = new Date(item.openedDate).getTime();
        const lastUsed = new Date(newHistory[newHistory.length - 1].date).getTime();
        const daysSinceOpened = Math.max(1, Math.round((lastUsed - opened) / (1000 * 60 * 60 * 24)));
        avgLifespan = Math.round(daysSinceOpened / newHistory.length * item.quantity);
      }

      return {
        ...item,
        quantity: newQuantity,
        status: newStatus,
        usageHistory: newHistory,
        averageLifespanDays: avgLifespan,
        openedDate: item.openedDate || (type !== 'daily' ? now.split('T')[0] : item.openedDate),
      };
    }));

    const labels = { once: 'Used once', half: 'Used half', daily: 'Logged daily use', finished: 'Marked finished' };
    toast({ title: labels[type], description: 'Usage recorded ✓' });
  }, [setItems]);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => {
      const deletedItem = prev.find((item) => item.id === id);
      if (deletedItem) {
        setUndoStack((stack) => [...stack.slice(-9), { action: 'delete', data: deletedItem }]);
      }
      return prev.filter((item) => item.id !== id);
    });
    toast({
      title: "Item deleted",
      description: "The item has been removed from your inventory.",
    });
  }, [setItems]);

  const undoLastAction = useCallback(() => {
    const lastAction = undoStack[undoStack.length - 1];
    if (!lastAction) return;

    if (lastAction.action === 'delete') {
      setItems((prev) => [lastAction.data as InventoryItem, ...prev]);
      toast({
        title: "Undo successful",
        description: "The item has been restored.",
      });
    } else if (lastAction.action === 'update') {
      setItems((prev) =>
        prev.map((item) =>
          item.id === (lastAction.data as InventoryItem).id ? (lastAction.data as InventoryItem) : item
        )
      );
      toast({
        title: "Undo successful",
        description: "Your changes have been reverted.",
      });
    }
    setUndoStack((stack) => stack.slice(0, -1));
  }, [undoStack, setItems]);

  // Wishlist CRUD
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedDate'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0],
    };
    setWishlist((prev) => [newItem, ...prev]);
    toast({
      title: "Added to wishlist",
      description: `${newItem.name} has been added to your wishlist.`,
    });
  }, [setWishlist]);

  const updateWishlistItem = useCallback((id: string, updates: Partial<WishlistItem>) => {
    setWishlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, [setWishlist]);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist.",
    });
  }, [setWishlist]);

  const moveWishlistToInventory = useCallback((wishlistItem: WishlistItem) => {
    const newItem: Omit<InventoryItem, 'id'> = {
      name: wishlistItem.name,
      brand: wishlistItem.brand,
      category: wishlistItem.category,
      quantity: 1,
      minQuantity: 1,
      status: 'new',
      price: wishlistItem.estimatedPrice,
      purchaseDate: new Date().toISOString().split('T')[0],
    };
    addItem(newItem);
    removeFromWishlist(wishlistItem.id);
    toast({
      title: "Moved to inventory",
      description: `${wishlistItem.name} has been added to your inventory.`,
    });
  }, [addItem, removeFromWishlist]);

  // Travel Kit CRUD
  const createTravelKit = useCallback((kit: Omit<TravelKit, 'id' | 'createdDate'>) => {
    const newKit: TravelKit = {
      ...kit,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
    };
    setTravelKits((prev) => [newKit, ...prev]);
    toast({
      title: "Travel kit created",
      description: `${newKit.name} is ready for packing.`,
    });
    return newKit;
  }, [setTravelKits]);

  const updateTravelKit = useCallback((id: string, updates: Partial<TravelKit>) => {
    setTravelKits((prev) =>
      prev.map((kit) => (kit.id === id ? { ...kit, ...updates } : kit))
    );
  }, [setTravelKits]);

  const deleteTravelKit = useCallback((id: string) => {
    setTravelKits((prev) => prev.filter((kit) => kit.id !== id));
    toast({
      title: "Travel kit deleted",
      description: "The travel kit has been removed.",
    });
  }, [setTravelKits]);

  const toggleTravelItemPacked = useCallback((kitId: string, itemId: string) => {
    setTravelKits((prev) =>
      prev.map((kit) => {
        if (kit.id !== kitId) return kit;
        return {
          ...kit,
          items: kit.items.map((item) =>
            item.itemId === itemId ? { ...item, packed: !item.packed } : item
          ),
        };
      })
    );
  }, [setTravelKits]);

  const generateTravelKit = useCallback((name: string, destination?: string, tripDate?: string) => {
    const travelEssentials = items.filter((item) => item.isTravelEssential && item.quantity > 0);
    const kitItems: TravelKitItem[] = travelEssentials.map((item) => ({
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      quantity: item.travelQuantity || 1,
      packed: false,
    }));

    return createTravelKit({
      name,
      destination,
      tripDate,
      items: kitItems,
    });
  }, [items, createTravelKit]);

  // Query helpers
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
    }).sort((a, b) => {
      const dateA = new Date(a.expiryDate!).getTime();
      const dateB = new Date(b.expiryDate!).getTime();
      return dateA - dateB;
    });
  }, [items]);

  const expiredItems = useMemo(() => {
    const today = new Date();
    return items.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry < today;
    });
  }, [items]);

  const travelEssentials = useMemo(
    () => items.filter((item) => item.isTravelEssential),
    [items]
  );

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
