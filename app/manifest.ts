import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StockLuhh - Smart Inventory Tracker',
    short_name: 'StockLuhh',
    description:
      'Track your household inventory, get low-stock alerts, expiry reminders, and never overbuy again.',
    theme_color: '#4F9D8F',
    background_color: '#E3E7ED',
    display: 'standalone',
    orientation: 'portrait-primary',
    scope: '/',
    start_url: '/',
    lang: 'en',
    categories: ['lifestyle', 'utilities', 'productivity'],
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Add Item',
        short_name: 'Add',
        description: 'Add a new item to inventory',
        url: '/inventory?action=add',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Shopping List',
        short_name: 'Shop',
        description: 'View items to buy',
        url: '/shopping',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
