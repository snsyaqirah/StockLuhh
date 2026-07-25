export type ItemStatus = 'new' | 'in-use' | 'low' | 'finished';

export type ItemCategory =
  | 'toiletries'
  | 'skincare'
  | 'haircare'
  | 'dental'
  | 'cleaning'
  | 'grocery'
  | 'snacks'
  | 'beverages'
  | 'medicine'
  | 'other';

export interface InventoryItem {
  id: string;
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
  notes?: string;
  imageUrl?: string;
  // Travel mode
  isTravelEssential?: boolean;
  travelQuantity?: number;
  // Usage tracking
  usageHistory?: UsageRecord[];
  averageLifespanDays?: number;
}

export interface UsageRecord {
  id: string;
  action: 'opened' | 'finished' | 'restocked' | 'once' | 'half' | 'daily';
  date: string;
  quantity?: number;
  quantityUsed?: number;
  notes?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  brand?: string;
  category: ItemCategory;
  estimatedPrice?: number;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  addedDate: string;
  productUrl?: string;
  rating?: number; // 1-5 stars for current product comparison
}

export interface TravelKit {
  id: string;
  name: string;
  items: TravelKitItem[];
  createdDate: string;
  tripDate?: string;
  destination?: string;
}

export interface TravelKitItem {
  itemId: string;
  itemName: string;
  category: ItemCategory;
  quantity: number;
  packed: boolean;
}

export interface CategoryInfo {
  id: ItemCategory;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'toiletries', label: 'Toiletries', icon: 'Droplets', color: 'bg-blue-100 text-blue-600' },
  { id: 'skincare', label: 'Skincare', icon: 'Sparkles', color: 'bg-pink-100 text-pink-600' },
  { id: 'haircare', label: 'Haircare', icon: 'Wind', color: 'bg-purple-100 text-purple-600' },
  { id: 'dental', label: 'Dental', icon: 'Smile', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'cleaning', label: 'Cleaning', icon: 'SprayCan', color: 'bg-green-100 text-green-600' },
  { id: 'grocery', label: 'Grocery', icon: 'ShoppingBasket', color: 'bg-amber-100 text-amber-600' },
  { id: 'snacks', label: 'Snacks', icon: 'Cookie', color: 'bg-orange-100 text-orange-600' },
  { id: 'beverages', label: 'Beverages', icon: 'Coffee', color: 'bg-rose-100 text-rose-600' },
  { id: 'medicine', label: 'Medicine', icon: 'Pill', color: 'bg-red-100 text-red-600' },
  { id: 'other', label: 'Other', icon: 'Package', color: 'bg-slate-100 text-slate-600' },
];

export const STATUS_CONFIG = {
  'new': { label: 'New', color: 'bg-stock-full', textColor: 'text-stock-full' },
  'in-use': { label: 'In Use', color: 'bg-stock-good', textColor: 'text-stock-good' },
  'low': { label: 'Running Low', color: 'bg-stock-low', textColor: 'text-stock-low' },
  'finished': { label: 'Finished', color: 'bg-stock-empty', textColor: 'text-stock-empty' },
};

export const PRIORITY_CONFIG = {
  'low': { label: 'Low', color: 'bg-muted text-muted-foreground' },
  'medium': { label: 'Medium', color: 'bg-stock-low/15 text-stock-low' },
  'high': { label: 'High', color: 'bg-stock-empty/15 text-stock-empty' },
};
