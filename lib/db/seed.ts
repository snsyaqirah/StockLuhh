/**
 * Seeds the database with sample inventory/wishlist/travel-kit data.
 * Run with: npm run db:seed
 */
import 'dotenv/config';
import { db } from './index';
import { items, wishlistItems, travelKits } from './schema';
import type { ItemCategory, ItemStatus } from '@/types/inventory';

const mockInventory: Array<{
  seedId: string;
  name: string;
  brand?: string;
  category: ItemCategory;
  quantity: number;
  minQuantity: number;
  status: ItemStatus;
  size?: string;
  price?: number;
  purchaseDate?: string;
  openedDate?: string;
  expiryDate?: string;
  isTravelEssential?: boolean;
  travelQuantity?: number;
  averageLifespanDays?: number;
}> = [
  { seedId: '1', name: 'Cetaphil Gentle Cleanser', brand: 'Cetaphil', category: 'skincare', quantity: 2, minQuantity: 1, status: 'in-use', size: '500ml', price: 45.90, purchaseDate: '2024-11-15', openedDate: '2024-11-20', expiryDate: '2025-11-15', isTravelEssential: true, travelQuantity: 1 },
  { seedId: '2', name: 'Colgate Total Toothpaste', brand: 'Colgate', category: 'dental', quantity: 1, minQuantity: 2, status: 'low', size: '150g', price: 12.50, purchaseDate: '2024-10-01', isTravelEssential: true, travelQuantity: 1, averageLifespanDays: 60, openedDate: '2024-11-15' },
  { seedId: '3', name: 'Pantene Shampoo', brand: 'Pantene', category: 'haircare', quantity: 3, minQuantity: 1, status: 'new', size: '400ml', price: 28.90, purchaseDate: '2024-12-01', expiryDate: '2026-12-01', isTravelEssential: true, travelQuantity: 1 },
  { seedId: '4', name: 'Dove Body Wash', brand: 'Dove', category: 'toiletries', quantity: 0, minQuantity: 1, status: 'finished', size: '500ml', price: 18.90, purchaseDate: '2024-09-15', openedDate: '2024-09-20', isTravelEssential: true, travelQuantity: 1 },
  { seedId: '5', name: 'Sunscreen SPF50', brand: 'Biore', category: 'skincare', quantity: 1, minQuantity: 1, status: 'in-use', size: '50ml', price: 35.00, purchaseDate: '2024-11-01', openedDate: '2024-11-05', expiryDate: '2025-01-15', isTravelEssential: true, travelQuantity: 1 },
  { seedId: '6', name: 'Floor Cleaner', brand: 'Dettol', category: 'cleaning', quantity: 2, minQuantity: 1, status: 'new', size: '1L', price: 15.90, purchaseDate: '2024-12-10' },
  { seedId: '7', name: 'Instant Noodles', brand: 'Maggi', category: 'grocery', quantity: 5, minQuantity: 3, status: 'in-use', price: 8.50, purchaseDate: '2024-12-01', expiryDate: '2025-06-01' },
  { seedId: '8', name: 'Chocolate Cookies', brand: 'Oreo', category: 'snacks', quantity: 1, minQuantity: 2, status: 'low', price: 6.90, purchaseDate: '2024-12-15', expiryDate: '2025-03-15' },
  { seedId: '9', name: 'Green Tea', brand: 'Lipton', category: 'beverages', quantity: 2, minQuantity: 1, status: 'in-use', size: '25 bags', price: 12.00, purchaseDate: '2024-11-20', expiryDate: '2026-11-20' },
  { seedId: '10', name: 'Paracetamol', brand: 'Panadol', category: 'medicine', quantity: 1, minQuantity: 1, status: 'in-use', size: '20 tablets', price: 8.90, purchaseDate: '2024-10-15', expiryDate: '2026-10-15', isTravelEssential: true, travelQuantity: 1 },
];

const mockWishlist: Array<{
  name: string; brand?: string; category: ItemCategory; estimatedPrice?: number;
  priority: 'low' | 'medium' | 'high'; notes?: string; addedDate: string; rating?: number;
}> = [
  { name: 'CeraVe Moisturizing Cream', brand: 'CeraVe', category: 'skincare', estimatedPrice: 55.00, priority: 'high', notes: 'Heard great reviews about this for dry skin', addedDate: '2024-12-01', rating: 4 },
  { name: 'Olaplex Hair Treatment', brand: 'Olaplex', category: 'haircare', estimatedPrice: 120.00, priority: 'medium', notes: 'Want to try for damaged hair repair', addedDate: '2024-12-10' },
  { name: 'Bamboo Toothbrush Set', brand: 'Eco-Friendly', category: 'dental', estimatedPrice: 15.00, priority: 'low', notes: 'Trying to be more sustainable', addedDate: '2024-12-15' },
];

async function seed() {
  console.log('Seeding items...');
  const insertedItems = await db
    .insert(items)
    .values(mockInventory.map(({ seedId, ...item }) => item))
    .returning({ id: items.id });

  // seedId ('1'..'10') -> generated UUID, so the travel kit below can reference real ids
  const idMap = new Map(mockInventory.map((item, i) => [item.seedId, insertedItems[i].id]));

  console.log('Seeding wishlist...');
  await db.insert(wishlistItems).values(mockWishlist);

  console.log('Seeding travel kits...');
  await db.insert(travelKits).values([
    {
      name: 'Weekend Getaway',
      createdDate: '2024-12-01',
      tripDate: '2025-01-15',
      destination: 'Beach Resort',
      items: [
        { itemId: idMap.get('1')!, itemName: 'Cetaphil Gentle Cleanser', category: 'skincare', quantity: 1, packed: false },
        { itemId: idMap.get('2')!, itemName: 'Colgate Total Toothpaste', category: 'dental', quantity: 1, packed: false },
        { itemId: idMap.get('5')!, itemName: 'Sunscreen SPF50', category: 'skincare', quantity: 1, packed: false },
      ],
    },
  ]);

  console.log(`Done — seeded ${insertedItems.length} items, ${mockWishlist.length} wishlist entries, 1 travel kit.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
