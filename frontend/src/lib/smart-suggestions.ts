import { InventoryItem } from '@/types/inventory';
import { differenceInDays, addDays, format, isBefore } from 'date-fns';

export interface SmartSuggestion {
    id: string;
    itemId: string;
    itemName: string;
    type: 'usage_prediction' | 'low_stock' | 'expiring' | 'substitution';
    message: string;
    priority: 'high' | 'medium' | 'low';
    actionLabel?: string;
}

export function getSmartSuggestions(items: InventoryItem[]): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    items.forEach(item => {
        // 1. Usage Prediction (The "Smart" part)
        if (item.status === 'in-use' && item.averageLifespanDays && item.openedDate) {
            const opened = new Date(item.openedDate);
            const predictedEnd = addDays(opened, item.averageLifespanDays);
            const daysLeft = differenceInDays(predictedEnd, new Date());

            // If predicted to finish in next 7 days
            if (daysLeft >= 0 && daysLeft <= 10) {
                suggestions.push({
                    id: `predict-${item.id}`,
                    itemId: item.id,
                    itemName: item.name,
                    type: 'usage_prediction',
                    message: `Based on your habits, you'll finish ${item.name} in about ${daysLeft} days.`,
                    priority: 'medium',
                    actionLabel: 'Add to Shopping List'
                });
            } else if (daysLeft < 0) {
                // Should have finished by now
                suggestions.push({
                    id: `predict-overdue-${item.id}`,
                    itemId: item.id,
                    itemName: item.name,
                    type: 'usage_prediction',
                    message: `You usually finish ${item.name} by now. Have you restocked?`,
                    priority: 'low',
                    actionLabel: 'Mark as Finished'
                });
            }
        }

        // 2. Low Stock (Quantity <= Min Quantity)
        if (item.quantity <= item.minQuantity && item.status !== 'finished') {
            suggestions.push({
                id: `low-${item.id}`,
                itemId: item.id,
                itemName: item.name,
                type: 'low_stock',
                message: `${item.name} is running low (${item.quantity} left). Min: ${item.minQuantity}`,
                priority: 'high',
                actionLabel: 'Restock'
            });
        }

        // 3. Expiry
        if (item.expiryDate) {
            const days = differenceInDays(new Date(item.expiryDate), new Date());
            if (days > 0 && days <= 14) {
                suggestions.push({
                    id: `exp-${item.id}`,
                    itemId: item.id,
                    itemName: item.name,
                    type: 'expiring',
                    message: `${item.name} expires in ${days} days!`,
                    priority: 'high',
                    actionLabel: 'Use Now'
                });
            }
        }

        // 4. Smart Substitutions - when item is finished, suggest alternatives
        if (item.status === 'finished' || item.quantity === 0) {
            const alternatives = items.filter(alt =>
                alt.id !== item.id &&
                alt.category === item.category &&
                alt.quantity > 0 &&
                alt.status !== 'finished'
            ).slice(0, 2);

            if (alternatives.length > 0) {
                const altNames = alternatives.map(a => a.name).join(' or ');
                suggestions.push({
                    id: `sub-${item.id}`,
                    itemId: item.id,
                    itemName: item.name,
                    type: 'substitution',
                    message: `${item.name} is finished. You can use: ${altNames}`,
                    priority: 'low',
                    actionLabel: 'Got it'
                });
            }
        }
    });

    // Sort by priority
    const priorityScore = { high: 3, medium: 2, low: 1 };
    return suggestions.sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority]);
}
