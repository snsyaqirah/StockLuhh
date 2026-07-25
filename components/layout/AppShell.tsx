'use client';

/**
 * App Shell
 * Wraps every page with header, bottom nav, and PWA banners/FAB.
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { InstallBanner, UpdateBanner } from '@/components/common/InstallBanner';
import { FAB } from '@/components/common/FAB';
import { cn } from '@/lib/utils';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function AppShell({ children }: { children: ReactNode }) {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen bg-background">
      {/* PWA banners */}
      <OfflineBanner />
      <UpdateBanner />

      {/* Header */}
      <Header />

      {/* Main content with proper padding for bottom nav */}
      <main
        className={cn(
          'container py-6 md:py-8 pb-24 lg:pb-8',
          // Add top padding when offline banner is shown
          !isOnline && 'pt-14'
        )}
      >
        {children}
      </main>

      {/* Bottom navigation (mobile only) */}
      <BottomNav />

      {/* Install prompt (after a delay) */}
      <InstallBanner />

      {/* Floating Action Button (mobile) */}
      <FAB />
    </div>
  );
}
