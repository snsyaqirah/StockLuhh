/**
 * Offline Banner Component
 * Shows when user goes offline (important for PWA)
 */

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineBannerProps {
    className?: string;
}

export function OfflineBanner({ className }: OfflineBannerProps) {
    const isOnline = useOnlineStatus();

    if (isOnline) return null;

    return (
        <div
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] bg-stock-low text-white py-2 px-4',
                'flex items-center justify-center gap-2 text-sm font-medium',
                'animate-fade-in',
                className
            )}
        >
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Some features may be limited.</span>
        </div>
    );
}
