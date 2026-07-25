/**
 * Application constants for StockLuhh
 * Centralized configuration values
 */

// Application Info
export const APP_NAME = 'StockLuhh';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Smart Inventory Tracker';

// Storage Keys (for localStorage)
export const STORAGE_KEYS = {
  INVENTORY: 'stockluhh-inventory',
  WISHLIST: 'stockluhh-wishlist',
  TRAVEL_KITS: 'stockluhh-travel-kits',
  THEME: 'stockluhh-theme',
  SETTINGS: 'stockluhh-settings',
} as const;

// Default Settings
export const DEFAULT_SETTINGS = {
  lowStockThreshold: 1,
  expiryWarningDays: 30,
  currency: 'RM',
  dateFormat: 'dd/MM/yyyy',
  locale: 'ms-MY',
} as const;

// Category Colors (matching the design system)
export const CATEGORY_COLORS = {
  toiletries: { bg: 'bg-blue-100', text: 'text-blue-600', dark: { bg: 'dark:bg-blue-900/30', text: 'dark:text-blue-400' } },
  skincare: { bg: 'bg-pink-100', text: 'text-pink-600', dark: { bg: 'dark:bg-pink-900/30', text: 'dark:text-pink-400' } },
  haircare: { bg: 'bg-purple-100', text: 'text-purple-600', dark: { bg: 'dark:bg-purple-900/30', text: 'dark:text-purple-400' } },
  dental: { bg: 'bg-cyan-100', text: 'text-cyan-600', dark: { bg: 'dark:bg-cyan-900/30', text: 'dark:text-cyan-400' } },
  cleaning: { bg: 'bg-green-100', text: 'text-green-600', dark: { bg: 'dark:bg-green-900/30', text: 'dark:text-green-400' } },
  grocery: { bg: 'bg-amber-100', text: 'text-amber-600', dark: { bg: 'dark:bg-amber-900/30', text: 'dark:text-amber-400' } },
  snacks: { bg: 'bg-orange-100', text: 'text-orange-600', dark: { bg: 'dark:bg-orange-900/30', text: 'dark:text-orange-400' } },
  beverages: { bg: 'bg-rose-100', text: 'text-rose-600', dark: { bg: 'dark:bg-rose-900/30', text: 'dark:text-rose-400' } },
  medicine: { bg: 'bg-red-100', text: 'text-red-600', dark: { bg: 'dark:bg-red-900/30', text: 'dark:text-red-400' } },
  other: { bg: 'bg-slate-100', text: 'text-slate-600', dark: { bg: 'dark:bg-slate-800', text: 'dark:text-slate-400' } },
} as const;

// Status Colors
export const STATUS_COLORS = {
  new: { label: 'New', color: 'bg-stock-full', textColor: 'text-stock-full' },
  'in-use': { label: 'In Use', color: 'bg-stock-good', textColor: 'text-stock-good' },
  low: { label: 'Running Low', color: 'bg-stock-low', textColor: 'text-stock-low' },
  finished: { label: 'Finished', color: 'bg-stock-empty', textColor: 'text-stock-empty' },
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-stock-low/15 text-stock-low' },
  high: { label: 'High', color: 'bg-stock-empty/15 text-stock-empty' },
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/inventory', label: 'Inventory', icon: 'Package' },
  { path: '/shopping', label: 'Shopping', icon: 'ShoppingCart' },
  { path: '/expiry', label: 'Expiry', icon: 'Calendar' },
  { path: '/travel', label: 'Travel', icon: 'Plane' },
  { path: '/wishlist', label: 'Wishlist', icon: 'Heart' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
] as const;

// Bottom Navigation (mobile - main 5 items)
export const BOTTOM_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'LayoutDashboard' },
  { path: '/inventory', label: 'Items', icon: 'Package' },
  { path: '/shopping', label: 'Shop', icon: 'ShoppingCart' },
  { path: '/expiry', label: 'Expiry', icon: 'Calendar' },
  { path: '/analytics', label: 'Stats', icon: 'BarChart3' },
] as const;

// API Configuration (for future backend)
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
} as const;
