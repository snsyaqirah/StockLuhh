/**
 * User Preferences Hook
 * Manages user mode (Simple/Smart/Power) and other app preferences
 */

import { useLocalStorage } from './useLocalStorage';

export type UserMode = 'simple' | 'smart' | 'power';

export interface UserPreferences {
    mode: UserMode;
    onboardingComplete: boolean;
    usageEventCount: number;
    firstUseDate: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    mode: 'simple',
    onboardingComplete: false,
    usageEventCount: 0,
    firstUseDate: new Date().toISOString().split('T')[0],
};

// Features available per mode
export const MODE_FEATURES = {
    simple: {
        label: 'Simple',
        description: 'Dashboard, Inventory, Shopping List',
        pages: ['/', '/inventory', '/shopping'],
        navItems: ['home', 'inventory', 'shopping'],
    },
    smart: {
        label: 'Smart',
        description: '+ Expiry Tracker, Smart Suggestions',
        pages: ['/', '/inventory', '/shopping', '/expiry'],
        navItems: ['home', 'inventory', 'shopping', 'expiry'],
    },
    power: {
        label: 'Power',
        description: '+ Analytics, Travel, Wishlist',
        pages: ['/', '/inventory', '/shopping', '/expiry', '/analytics', '/travel', '/wishlist'],
        navItems: ['home', 'inventory', 'shopping', 'expiry', 'analytics'],
    },
} as const;

export function useUserPreferences() {
    const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
        'stockluhh-preferences',
        DEFAULT_PREFERENCES
    );

    const setMode = (mode: UserMode) => {
        setPreferences((prev) => ({ ...prev, mode }));
    };

    const completeOnboarding = () => {
        setPreferences((prev) => ({ ...prev, onboardingComplete: true }));
    };

    const incrementUsageCount = () => {
        setPreferences((prev) => ({ ...prev, usageEventCount: prev.usageEventCount + 1 }));
    };

    // Auto-upgrade mode based on usage (Progressive Disclosure)
    const checkAutoUpgrade = () => {
        const { usageEventCount, mode, firstUseDate } = preferences;
        const daysSinceFirst = Math.floor(
            (Date.now() - new Date(firstUseDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        // Upgrade to Smart after 5 usage events OR 7 days
        if (mode === 'simple' && (usageEventCount >= 5 || daysSinceFirst >= 7)) {
            setMode('smart');
            return 'smart';
        }

        // Upgrade to Power after 20 usage events OR 14 days
        if (mode === 'smart' && (usageEventCount >= 20 || daysSinceFirst >= 14)) {
            setMode('power');
            return 'power';
        }

        return null;
    };

    const currentFeatures = MODE_FEATURES[preferences.mode];

    return {
        preferences,
        mode: preferences.mode,
        setMode,
        completeOnboarding,
        incrementUsageCount,
        checkAutoUpgrade,
        currentFeatures,
        isPageAllowed: (path: string) => (currentFeatures.pages as readonly string[]).includes(path),
        isNavItemAllowed: (navId: string) => (currentFeatures.navItems as readonly string[]).includes(navId),
    };
}
