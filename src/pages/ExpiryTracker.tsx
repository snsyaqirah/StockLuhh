import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { Card } from '@/components/ui/card';
import { ItemCard } from '@/components/inventory/ItemCard';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ExpiryTracker() {
  const { expiringItems, expiredItems, items } = useInventory();

  const getUrgencyLevel = (expiryDate: string) => {
    const days = differenceInDays(new Date(expiryDate), new Date());
    if (days < 0) return { label: 'Expired', color: 'text-stock-expired', bg: 'bg-stock-expired/10' };
    if (days <= 7) return { label: 'This week', color: 'text-stock-empty', bg: 'bg-stock-empty/10' };
    if (days <= 14) return { label: '2 weeks', color: 'text-stock-low', bg: 'bg-stock-low/10' };
    return { label: '30 days', color: 'text-stock-good', bg: 'bg-stock-good/10' };
  };

  const allExpiryItems = [...expiredItems, ...expiringItems];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Expiry Tracker</h1>
          <p className="text-muted-foreground">Monitor items nearing expiration</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center border-stock-expired/30 bg-stock-expired/5">
            <p className="text-2xl font-bold text-stock-expired">{expiredItems.length}</p>
            <p className="text-sm text-muted-foreground">Expired</p>
          </Card>
          <Card className="p-4 text-center border-stock-low/30 bg-stock-low/5">
            <p className="text-2xl font-bold text-stock-low">{expiringItems.filter(i => differenceInDays(new Date(i.expiryDate!), new Date()) <= 14).length}</p>
            <p className="text-sm text-muted-foreground">Within 2 weeks</p>
          </Card>
          <Card className="p-4 text-center border-stock-good/30 bg-stock-good/5">
            <p className="text-2xl font-bold text-stock-good">{expiringItems.filter(i => differenceInDays(new Date(i.expiryDate!), new Date()) > 14).length}</p>
            <p className="text-sm text-muted-foreground">Within 30 days</p>
          </Card>
        </div>

        {allExpiryItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-stock-good/15 mb-4">
              <Calendar className="h-8 w-8 text-stock-good" />
            </div>
            <h3 className="text-lg font-medium">All clear!</h3>
            <p className="text-muted-foreground mt-1">No items expiring in the next 30 days</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allExpiryItems.map((item, index) => {
              const urgency = getUrgencyLevel(item.expiryDate!);
              const daysLeft = differenceInDays(new Date(item.expiryDate!), new Date());
              return (
                <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className={cn("p-3 rounded-xl mb-2", urgency.bg)}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className={cn("h-4 w-4", urgency.color)} />
                      <span className={cn("text-sm font-medium", urgency.color)}>
                        {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? 'Expires today!' : `${daysLeft} days left`}
                      </span>
                    </div>
                    <ItemCard item={item} showActions={false} className="!shadow-none !border-0 !bg-transparent !p-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
