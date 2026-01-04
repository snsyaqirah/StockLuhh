/**
 * Smart Substitutions - Suggest alternatives when items are low/expired
 * Groups items by category and suggests available alternatives
 */

import { InventoryItem, ItemCategory } from '@/types/inventory';

export interface Substitution {
    forItem: InventoryItem;
    alternatives: InventoryItem[];
    message: string;
}

// Category groups that can substitute for each other
const SUBSTITUTION_GROUPS: Record<string, ItemCategory[]> = {
    oral_care: ['dental', 'toiletries'],
    skincare: ['skincare', 'toiletries'],
    cleaning: ['cleaning', 'toiletries'],
    food: ['grocery', 'snacks', 'beverages'],
};

export function getSmartSubstitutions(items: InventoryItem[]): Substitution[] {
    const substitutions: Substitution[] = [];

    // Find items that need substitutes (low, finished, or expired)
    const needsSubstitute = items.filter(item => {
        if (item.status === 'low' || item.status === 'finished') return true;
        if (item.expiryDate && new Date(item.expiryDate) < new Date()) return true;
        return false;
    });

    needsSubstitute.forEach(needyItem => {
        // Find which group this category belongs to
        const group = Object.entries(SUBSTITUTION_GROUPS).find(([_, cats]) =>
            cats.includes(needyItem.category)
        );

        if (!group) return;

        const [groupName, categories] = group;

        // Find available alternatives (in stock, not expired)
        const alternatives = items.filter(item => {
            if (item.id === needyItem.id) return false; // Not itself
            if (!categories.includes(item.category)) return false; // Must be in same group
            if (item.quantity <= 0) return false; // Must have stock
            if (item.status === 'finished') return false;

            // Check expiry
            if (item.expiryDate && new Date(item.expiryDate) < new Date()) return false;

            return true;
        }).slice(0, 3); // Max 3 alternatives

        if (alternatives.length > 0) {
            const names = alternatives.map(a => a.name).join(', ');
            substitutions.push({
                forItem: needyItem,
                alternatives,
                message: `${needyItem.name} is ${needyItem.status === 'finished' ? 'finished' : 'running low'}. You have: ${names}`
            });
        }
    });

    return substitutions;
}
