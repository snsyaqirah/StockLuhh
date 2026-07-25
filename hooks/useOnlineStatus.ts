/**
 * Hook to track online/offline status
 * Useful for showing offline banner in PWA
 */

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
    // Always start `true` on both server and client so the first client render
    // matches SSR output — navigator.onLine is only read after mount, in the
    // effect below, to avoid a hydration mismatch.
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
