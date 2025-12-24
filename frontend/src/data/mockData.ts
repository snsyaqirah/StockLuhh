import { InventoryItem, WishlistItem, TravelKit } from '@/types/inventory';

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Cetaphil Gentle Cleanser',
    brand: 'Cetaphil',
    category: 'skincare',
    quantity: 2,
    minQuantity: 1,
    status: 'in-use',
    size: '500ml',
    price: 45.90,
    purchaseDate: '2024-11-15',
    openedDate: '2024-11-20',
    expiryDate: '2025-11-15',
    isTravelEssential: true,
    travelQuantity: 1,
  },
  {
    id: '2',
    name: 'Colgate Total Toothpaste',
    brand: 'Colgate',
    category: 'dental',
    quantity: 1,
    minQuantity: 2,
    status: 'low',
    size: '150g',
    price: 12.50,
    purchaseDate: '2024-10-01',
    isTravelEssential: true,
    travelQuantity: 1,
  },
  {
    id: '3',
    name: 'Pantene Shampoo',
    brand: 'Pantene',
    category: 'haircare',
    quantity: 3,
    minQuantity: 1,
    status: 'new',
    size: '400ml',
    price: 28.90,
    purchaseDate: '2024-12-01',
    expiryDate: '2026-12-01',
    isTravelEssential: true,
    travelQuantity: 1,
  },
  {
    id: '4',
    name: 'Dove Body Wash',
    brand: 'Dove',
    category: 'toiletries',
    quantity: 0,
    minQuantity: 1,
    status: 'finished',
    size: '500ml',
    price: 18.90,
    purchaseDate: '2024-09-15',
    openedDate: '2024-09-20',
    isTravelEssential: true,
    travelQuantity: 1,
  },
  {
    id: '5',
    name: 'Sunscreen SPF50',
    brand: 'Biore',
    category: 'skincare',
    quantity: 1,
    minQuantity: 1,
    status: 'in-use',
    size: '50ml',
    price: 35.00,
    purchaseDate: '2024-11-01',
    openedDate: '2024-11-05',
    expiryDate: '2025-01-15',
    isTravelEssential: true,
    travelQuantity: 1,
  },
  {
    id: '6',
    name: 'Floor Cleaner',
    brand: 'Dettol',
    category: 'cleaning',
    quantity: 2,
    minQuantity: 1,
    status: 'new',
    size: '1L',
    price: 15.90,
    purchaseDate: '2024-12-10',
  },
  {
    id: '7',
    name: 'Instant Noodles',
    brand: 'Maggi',
    category: 'grocery',
    quantity: 5,
    minQuantity: 3,
    status: 'in-use',
    price: 8.50,
    purchaseDate: '2024-12-01',
    expiryDate: '2025-06-01',
  },
  {
    id: '8',
    name: 'Chocolate Cookies',
    brand: "Oreo",
    category: 'snacks',
    quantity: 1,
    minQuantity: 2,
    status: 'low',
    price: 6.90,
    purchaseDate: '2024-12-15',
    expiryDate: '2025-03-15',
  },
  {
    id: '9',
    name: 'Green Tea',
    brand: 'Lipton',
    category: 'beverages',
    quantity: 2,
    minQuantity: 1,
    status: 'in-use',
    size: '25 bags',
    price: 12.00,
    purchaseDate: '2024-11-20',
    expiryDate: '2026-11-20',
  },
  {
    id: '10',
    name: 'Paracetamol',
    brand: 'Panadol',
    category: 'medicine',
    quantity: 1,
    minQuantity: 1,
    status: 'in-use',
    size: '20 tablets',
    price: 8.90,
    purchaseDate: '2024-10-15',
    expiryDate: '2026-10-15',
    isTravelEssential: true,
    travelQuantity: 1,
  },
];

export const mockWishlist: WishlistItem[] = [
  {
    id: 'w1',
    name: 'CeraVe Moisturizing Cream',
    brand: 'CeraVe',
    category: 'skincare',
    estimatedPrice: 55.00,
    priority: 'high',
    notes: 'Heard great reviews about this for dry skin',
    addedDate: '2024-12-01',
    rating: 4,
  },
  {
    id: 'w2',
    name: 'Olaplex Hair Treatment',
    brand: 'Olaplex',
    category: 'haircare',
    estimatedPrice: 120.00,
    priority: 'medium',
    notes: 'Want to try for damaged hair repair',
    addedDate: '2024-12-10',
  },
  {
    id: 'w3',
    name: 'Bamboo Toothbrush Set',
    brand: 'Eco-Friendly',
    category: 'dental',
    estimatedPrice: 15.00,
    priority: 'low',
    notes: 'Trying to be more sustainable',
    addedDate: '2024-12-15',
  },
];

export const mockTravelKits: TravelKit[] = [
  {
    id: 'tk1',
    name: 'Weekend Getaway',
    createdDate: '2024-12-01',
    tripDate: '2025-01-15',
    destination: 'Beach Resort',
    items: [
      { itemId: '1', itemName: 'Cetaphil Gentle Cleanser', category: 'skincare', quantity: 1, packed: false },
      { itemId: '2', itemName: 'Colgate Total Toothpaste', category: 'dental', quantity: 1, packed: false },
      { itemId: '5', itemName: 'Sunscreen SPF50', category: 'skincare', quantity: 1, packed: false },
    ],
  },
];

export const getSpendingByCategory = () => {
  const spending: Record<string, number> = {};
  mockInventory.forEach(item => {
    if (item.price) {
      spending[item.category] = (spending[item.category] || 0) + (item.price * item.quantity);
    }
  });
  return Object.entries(spending).map(([category, amount]) => ({
    category,
    amount: Math.round(amount * 100) / 100,
  }));
};

export const getItemsByStatus = () => {
  const counts = { new: 0, 'in-use': 0, low: 0, finished: 0 };
  mockInventory.forEach(item => {
    counts[item.status]++;
  });
  return counts;
};

export const getLowStockItems = () => {
  return mockInventory.filter(item => item.status === 'low' || item.status === 'finished');
};

export const getExpiringItems = (daysAhead: number = 30) => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return mockInventory.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    return expiry <= futureDate && expiry >= today;
  });
};

export const getTravelEssentials = () => {
  return mockInventory.filter(item => item.isTravelEssential);
};
