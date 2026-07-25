import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'StockLuhh - Smart Inventory Tracker',
  description:
    'Track your household inventory, get low-stock alerts, expiry reminders, and never overbuy again. Your personal stock manager for toiletries, groceries, and more.',
  authors: [{ name: 'Syaqi' }],
  keywords: [
    'inventory tracker',
    'stock management',
    'expiry tracker',
    'shopping list',
    'household inventory',
    'pantry tracker',
  ],
  applicationName: 'StockLuhh',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StockLuhh',
  },
  openGraph: {
    type: 'website',
    title: 'StockLuhh - Smart Inventory Tracker',
    description: 'Track your household inventory, get low-stock alerts, expiry reminders, and never overbuy again.',
    siteName: 'StockLuhh',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockLuhh - Smart Inventory Tracker',
    description: 'Track your household inventory, get low-stock alerts, expiry reminders, and never overbuy again.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#4F9D8F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
