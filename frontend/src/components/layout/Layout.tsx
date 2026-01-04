/**
 * Main Layout Component
 * Wraps all pages with header, bottom nav, and common features
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner, InstallBanner, UpdateBanner, FAB } from '@/components/common';
import { cn } from '@/lib/utils';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface LayoutProps {
  children: ReactNode;
  /** Hide bottom navigation (for special pages) */
  hideBottomNav?: boolean;
  /** Additional className for main content */
  className?: string;
}

export function Layout({ children, hideBottomNav = false, className }: LayoutProps) {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen gradient-warm">
      {/* PWA banners */}
      <OfflineBanner />
      <UpdateBanner />

      {/* Header */}
      <Header />

      {/* Main content with proper padding for bottom nav */}
      <main
        className={cn(
          'container py-6 md:py-8',
          // Add bottom padding on mobile for bottom nav
          !hideBottomNav && 'pb-24 lg:pb-8',
          // Add top padding when offline banner is shown
          !isOnline && 'pt-14',
          className
        )}
      >
        {children}
      </main>

      {/* Bottom navigation (mobile only) */}
      {!hideBottomNav && <BottomNav />}

      {/* Install prompt (after a delay) */}
      <InstallBanner />

      {/* Floating Action Button (mobile) */}
      <FAB />
    </div>
  );
}
