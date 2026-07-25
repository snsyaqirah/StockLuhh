'use client';

import { Package, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentItems } from '@/components/dashboard/RecentItems';
import { SpendingChart } from '@/components/charts/SpendingChart';
import { useInventory } from '@/hooks/useInventory';
import { SmartSuggestions } from '@/components/dashboard/SmartSuggestions';

export default function Dashboard() {
  const {
    items,
    addItem,
    stats,
    lowStockItems,
    expiringItems,
    spendingByCategory
  } = useInventory();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your inventory overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          subtitle={`${stats.totalQuantity} units total`}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Low Stock"
          value={lowStockItems.length}
          subtitle="Items need restocking"
          icon={<ShoppingCart className="h-5 w-5" />}
          iconClassName="bg-stock-low/15 text-stock-low"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringItems.length}
          subtitle="Within 30 days"
          icon={<AlertTriangle className="h-5 w-5" />}
          iconClassName="bg-destructive/15 text-destructive"
        />
        <StatCard
          title="Total Value"
          value={`RM${stats.totalSpending.toFixed(0)}`}
          subtitle="Inventory worth"
          icon={<DollarSign className="h-5 w-5" />}
          iconClassName="bg-accent/15 text-accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Quick Actions */}
        <div className="space-y-6">
          <SmartSuggestions items={items} />
          <QuickActions onAddItem={addItem} lowStockCount={lowStockItems.length} />
          <SpendingChart data={spendingByCategory} />
        </div>

        {/* Right Column - Lists */}
        <div className="lg:col-span-2 space-y-6">
          <RecentItems
            items={lowStockItems}
            title="Needs Restocking"
            emptyMessage="All items are well-stocked!"
            viewAllLink="/shopping"
          />

          <RecentItems
            items={expiringItems}
            title="Expiring Soon"
            emptyMessage="No items expiring in the next 30 days"
            viewAllLink="/expiry"
          />
        </div>
      </div>
    </div>
  );
}
