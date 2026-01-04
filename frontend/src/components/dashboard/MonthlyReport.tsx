/**
 * Monthly Stock Report Component
 * Auto-generated summary showing savings, waste reduction, and usage insights
 */

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { InventoryItem } from '@/types/inventory';
import { TrendingUp, Trash2, ShoppingCart, Award, Calendar } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

interface MonthlyReportProps {
    items: InventoryItem[];
}

export function MonthlyStockReport({ items }: MonthlyReportProps) {
    const report = useMemo(() => {
        const thirtyDaysAgo = subDays(new Date(), 30);

        // Items purchased this month
        const purchasedThisMonth = items.filter(item =>
            item.purchaseDate && isAfter(new Date(item.purchaseDate), thirtyDaysAgo)
        );

        // Total spent
        const totalSpent = purchasedThisMonth.reduce((sum, item) =>
            sum + (item.price || 0) * item.quantity, 0
        );

        // Items finished (used up)
        const finishedItems = items.filter(item => item.status === 'finished');

        // Expired items (waste)
        const expiredItems = items.filter(item =>
            item.expiryDate && new Date(item.expiryDate) < new Date()
        );
        const wasteValue = expiredItems.reduce((sum, item) => sum + (item.price || 0), 0);

        // Items with usage history
        const trackedItems = items.filter(item =>
            item.usageHistory && item.usageHistory.length > 0
        );

        // Health score: (100 - waste%) capped at 100
        const totalInventoryValue = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
        const healthScore = totalInventoryValue > 0
            ? Math.round(100 - (wasteValue / totalInventoryValue * 100))
            : 100;

        return {
            period: `${format(thirtyDaysAgo, 'MMM d')} - ${format(new Date(), 'MMM d, yyyy')}`,
            itemsBought: purchasedThisMonth.length,
            totalSpent,
            itemsUsed: finishedItems.length,
            itemsExpired: expiredItems.length,
            wasteValue,
            trackedItems: trackedItems.length,
            healthScore: Math.max(0, Math.min(100, healthScore)),
        };
    }, [items]);

    const stats = [
        {
            icon: ShoppingCart,
            label: 'Items Bought',
            value: report.itemsBought,
            subtext: `RM ${report.totalSpent.toFixed(0)} spent`,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
        },
        {
            icon: TrendingUp,
            label: 'Items Used',
            value: report.itemsUsed,
            subtext: 'Consumed this month',
            color: 'text-green-500',
            bg: 'bg-green-500/10',
        },
        {
            icon: Trash2,
            label: 'Expired',
            value: report.itemsExpired,
            subtext: `RM ${report.wasteValue.toFixed(0)} wasted`,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
        },
        {
            icon: Award,
            label: 'Health Score',
            value: `${report.healthScore}%`,
            subtext: report.healthScore >= 80 ? 'Excellent!' : report.healthScore >= 50 ? 'Good' : 'Needs improvement',
            color: report.healthScore >= 80 ? 'text-green-500' : report.healthScore >= 50 ? 'text-amber-500' : 'text-red-500',
            bg: report.healthScore >= 80 ? 'bg-green-500/10' : report.healthScore >= 50 ? 'bg-amber-500/10' : 'bg-red-500/10',
        },
    ];

    return (
        <Card className="p-5 gradient-card shadow-card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Monthly Report</h3>
                </div>
                <span className="text-xs text-muted-foreground">{report.period}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div key={stat.label} className={`p-3 rounded-lg ${stat.bg}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {report.healthScore >= 80 && (
                <div className="mt-4 p-3 bg-green-500/10 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-600">
                        🎉 Great job! You've reduced waste this month.
                    </p>
                </div>
            )}
        </Card>
    );
}
