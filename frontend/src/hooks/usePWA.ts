/**
 * Hook for PWA functionality
 * Handles install prompt and update notifications
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

export function usePWA() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        // Check if already installed as PWA
        const checkInstalled = () => {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const isIOSStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
            setIsInstalled(isStandalone || isIOSStandalone);
        };

        checkInstalled();

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setInstallPrompt(e);
            setIsInstallable(true);
        };

        // Listen for app installed
        const handleAppInstalled = () => {
            setInstallPrompt(null);
            setIsInstallable(false);
            setIsInstalled(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Listen for service worker updates
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                setUpdateAvailable(true);
                            }
                        });
                    }
                });
            });
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const promptInstall = useCallback(async () => {
        if (!installPrompt) return false;

        try {
            await installPrompt.prompt();
            const result = await installPrompt.userChoice;

            if (result.outcome === 'accepted') {
                setInstallPrompt(null);
                setIsInstallable(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error prompting install:', error);
            return false;
        }
    }, [installPrompt]);

    const reloadForUpdate = useCallback(() => {
        window.location.reload();
    }, []);

    return {
        isInstallable,
        isInstalled,
        updateAvailable,
        promptInstall,
        reloadForUpdate,
    };
}
