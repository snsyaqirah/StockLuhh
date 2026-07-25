/**
 * Install PWA Banner Component
 * Prompts users to install the app
 */

import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface InstallBannerProps {
    className?: string;
}

export function InstallBanner({ className }: InstallBannerProps) {
    const { isInstallable, promptInstall, isInstalled } = usePWA();
    const [dismissed, setDismissed] = useState(false);

    // Don't show if already installed, not installable, or dismissed
    if (isInstalled || !isInstallable || dismissed) return null;

    return (
        <div
            className={cn(
                'fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50',
                'bg-card rounded-[2rem] shadow-neu-flat-hover p-4',
                'animate-slide-up',
                className
            )}
        >
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl shadow-neu-inset-sm flex items-center justify-center flex-shrink-0">
                    <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">Install StockLuhh</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Add to your home screen for quick access
                    </p>
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={promptInstall}>
                            Install
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDismissed(true)}
                        >
                            Not now
                        </Button>
                    </div>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

/**
 * Update Available Banner
 * Shows when a new version is available
 */
export function UpdateBanner({ className }: InstallBannerProps) {
    const { updateAvailable, reloadForUpdate } = usePWA();

    if (!updateAvailable) return null;

    return (
        <div
            className={cn(
                'fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground py-2 px-4',
                'flex items-center justify-center gap-3 text-sm',
                'animate-fade-in',
                className
            )}
        >
            <span>A new version is available!</span>
            <Button
                size="sm"
                variant="secondary"
                onClick={reloadForUpdate}
                className="h-7"
            >
                Update Now
            </Button>
        </div>
    );
}
