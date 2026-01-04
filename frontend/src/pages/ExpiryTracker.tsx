import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { Card } from '@/components/ui/card';
import { ItemCard } from '@/components/inventory/ItemCard';
import { AlertTriangle, Calendar, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getExpiryUrgency, formatDate, getDaysUntil } from '@/lib/formatters';
import { Button } from '@/components/ui/button';

export default function ExpiryTracker() {
  const { expiringItems, expiredItems, deleteItem, updateItem } = useInventory();

  // Combine all items with expiry dates for stats
  const allExpiryItems = [...expiredItems, ...expiringItems];

  // Categorize items
  const criticalItems = expiringItems.filter(i => {
    const days = getDaysUntil(i.expiryDate);
    return days !== null && days <= 7;
  });

  const upcomingItems = expiringItems.filter(i => {
    const days = getDaysUntil(i.expiryDate);
    return days !== null && days > 7;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Expiry Tracker</h1>
          <p className="text-muted-foreground">Monitor your pantry and supplies health</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Card className={cn(
            "p-3 md:p-4 text-center border transition-all hover:shadow-md",
            expiredItems.length > 0
              ? "border-stock-expired/30 bg-stock-expired/5"
              : "border-border"
          )}>
            <div className="flex justify-center mb-1">
              <AlertCircle className={cn(
                "h-5 w-5",
                expiredItems.length > 0 ? "text-stock-expired" : "text-muted-foreground"
              )} />
            </div>
            <p className={cn(
              "text-2xl font-bold",
              expiredItems.length > 0 ? "text-stock-expired" : "text-foreground"
            )}>
              {expiredItems.length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Expired</p>
          </Card>

          <Card className={cn(
            "p-3 md:p-4 text-center border transition-all hover:shadow-md",
            criticalItems.length > 0
              ? "border-stock-empty/30 bg-stock-empty/5"
              : "border-border"
          )}>
            <div className="flex justify-center mb-1">
              <AlertTriangle className={cn(
                "h-5 w-5",
                criticalItems.length > 0 ? "text-stock-empty" : "text-muted-foreground"
              )} />
            </div>
            <p className={cn(
              "text-2xl font-bold",
              criticalItems.length > 0 ? "text-stock-empty" : "text-foreground"
            )}>
              {criticalItems.length}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Next 7 Days</p>
          </Card>

          <Card className="p-3 md:p-4 text-center border border-stock-good/30 bg-stock-good/5 transition-all hover:shadow-md">
            <div className="flex justify-center mb-1">
              <CheckCircle2 className="h-5 w-5 text-stock-good" />
            </div>
            <p className="text-2xl font-bold text-stock-good">{upcomingItems.length}</p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">Safe (30 Days)</p>
          </Card>
        </div>

        {allExpiryItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-stock-good/10 mb-6 shadow-inner">
              <Calendar className="h-10 w-10 text-stock-good" />
            </div>
            <h3 className="text-xl font-semibold">Everything looks fresh!</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              No items are expiring in the next 30 days. Good job managing your inventory!
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            {/* 1. EXPIRED SECTION (Priority) */}
            {expiredItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-stock-expired font-bold text-lg">
                  <AlertCircle className="h-5 w-5" />
                  <h2>Expired Items</h2>
                </div>
                <div className="grid gap-3">
                  {expiredItems.map((item) => {
                    const urgency = getExpiryUrgency(item.expiryDate);
                    return (
                      <div key={item.id} className="relative group p-4 border border-stock-expired/30 bg-stock-expired/5 rounded-xl transition-all hover:shadow-md flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="bg-stock-expired text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Expired</div>
                            <span className="text-xs text-stock-expired font-medium">{item.expiryDate ? formatDate(item.expiryDate) : ''}</span>
                          </div>
                          <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.brand} • {item.quantity} units</p>
                        </div>

                        <div className="flex w-full sm:w-auto gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-stock-expired/50 text-stock-expired hover:bg-stock-expired/10 hover:text-stock-expired h-9"
                            onClick={() => {
                              if (confirm(`Confirm you discarded ${item.name}? This will remove it from inventory.`)) {
                                deleteItem(item.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Discard
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none h-9"
                            onClick={() => {
                              if (confirm(`Confirm you finished using ${item.name}?`)) {
                                updateItem(item.id, {
                                  status: 'finished',
                                  quantity: 0
                                });
                              }
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Used
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 2. CRITICAL SECTION (Within 7 days) */}
            {criticalItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-stock-empty font-bold text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <h2>Expiring This Week</h2>
                </div>
                <div className="grid gap-3">
                  {criticalItems.map((item) => {
                    const urgency = getExpiryUrgency(item.expiryDate);
                    const days = getDaysUntil(item.expiryDate);
                    return (
                      <div key={item.id} className="relative">
                        <div className="absolute inset-0 bg-stock-empty/5 rounded-xl border border-stock-empty/20 pointer-events-none" />
                        <ItemCard
                          item={item}
                          showActions={true}
                          className="!border-0 !bg-transparent !shadow-none pl-4"
                        />
                        <div className="absolute top-4 right-4 bg-stock-empty text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          {days === 0 ? 'Expires Today' : `${days} days left`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. UPCOMING SECTION (Safe but monitored) */}
            {upcomingItems.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-stock-good font-bold text-lg">
                  <Clock className="h-5 w-5" />
                  <h2>Coming Up</h2>
                </div>
                <div className="grid gap-3">
                  {upcomingItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      showActions={true}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
