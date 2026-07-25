import { pgTable, text, real, boolean, integer, timestamp, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';
import type { UsageRecord, TravelKitItem } from '@/types/inventory';

export const itemCategoryEnum = pgEnum('item_category', [
  'toiletries', 'skincare', 'haircare', 'dental', 'cleaning',
  'grocery', 'snacks', 'beverages', 'medicine', 'other',
]);

export const itemStatusEnum = pgEnum('item_status', ['new', 'in-use', 'low', 'finished']);

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high']);

export const items = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  category: itemCategoryEnum('category').notNull(),
  quantity: real('quantity').notNull().default(0),
  minQuantity: real('min_quantity').notNull().default(1),
  status: itemStatusEnum('status').notNull().default('new'),
  size: text('size'),
  price: real('price'),
  purchaseDate: text('purchase_date'),
  openedDate: text('opened_date'),
  expiryDate: text('expiry_date'),
  notes: text('notes'),
  imageUrl: text('image_url'),
  isTravelEssential: boolean('is_travel_essential').notNull().default(false),
  travelQuantity: real('travel_quantity'),
  usageHistory: jsonb('usage_history').$type<UsageRecord[]>().notNull().default([]),
  averageLifespanDays: real('average_lifespan_days'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const wishlistItems = pgTable('wishlist_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  category: itemCategoryEnum('category').notNull(),
  estimatedPrice: real('estimated_price'),
  priority: priorityEnum('priority').notNull().default('medium'),
  notes: text('notes'),
  addedDate: text('added_date').notNull(),
  productUrl: text('product_url'),
  rating: integer('rating'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const travelKits = pgTable('travel_kits', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  destination: text('destination'),
  tripDate: text('trip_date'),
  createdDate: text('created_date').notNull(),
  items: jsonb('items').$type<TravelKitItem[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ItemRow = typeof items.$inferSelect;
export type NewItemRow = typeof items.$inferInsert;
export type WishlistItemRow = typeof wishlistItems.$inferSelect;
export type NewWishlistItemRow = typeof wishlistItems.$inferInsert;
export type TravelKitRow = typeof travelKits.$inferSelect;
export type NewTravelKitRow = typeof travelKits.$inferInsert;
