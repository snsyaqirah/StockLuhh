/**
 * Update Banner - Shows when a new version is available
 */

import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function UpdateBanner() {
    const { updateAvailable, reloadForUpdate } = usePWA();

    if (!updateAvailable) return null;

    return (
        <div className="fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground py-2 px-4 flex items-center justify-between animate-slide-down">
            <span className="text-sm font-medium">A new version is available!</span>
            <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={reloadForUpdate}
            >
                <RefreshCw className="h-4 w-4" />
                Update
            </Button>
        </div>
    );
}
