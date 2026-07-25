'use client';

import { useInventory } from '@/hooks/useInventory';
import { ItemCard } from '@/components/inventory/ItemCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Share2, PackageCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ShoppingList() {
  const { lowStockItems, batchUpdateItems } = useInventory();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleRestock = () => {
    const updates = Array.from(checkedItems).map(id => {
      const item = lowStockItems.find(i => i.id === id);
      return {
        id,
        changes: {
          status: 'new' as const,
          quantity: (item?.quantity || 0) + 1,
          purchaseDate: new Date().toISOString().split('T')[0],
        }
      };
    });

    batchUpdateItems(updates);
    setCheckedItems(new Set());
    setIsRestockDialogOpen(false);
  };

  const totalEstimate = lowStockItems
    .filter((item) => !checkedItems.has(item.id))
    .reduce((sum, item) => sum + (item.price || 0), 0);

  const uncheckedCount = lowStockItems.filter((item) => !checkedItems.has(item.id)).length;
  const checkedCount = checkedItems.size;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Shopping List</h1>
          <p className="text-muted-foreground">
            {uncheckedCount} items to buy
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>

          <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={checkedCount === 0} className="gap-2">
                <PackageCheck className="h-4 w-4" />
                Restock Selected ({checkedCount})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Restock</DialogTitle>
                <DialogDescription>
                  Mark {checkedCount} items as bought? This will add 1 unit to each item and set their status to &quot;New&quot;.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-[300px] overflow-y-auto space-y-2 my-2">
                {Array.from(checkedItems).map(id => {
                  const item = lowStockItems.find(i => i.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="flex items-center justify-between text-sm p-2 bg-secondary/50 rounded-md">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">Qty: {item.quantity} → {item.quantity + 1}</span>
                    </div>
                  );
                })}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleRestock}>Confirm Purchase</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="p-4 gradient-card shadow-card border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Total</p>
            <p className="text-2xl font-bold">RM{totalEstimate.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {checkedItems.size} of {lowStockItems.length} checked
            </p>
            <div className="mt-1 h-2 w-32 rounded-full shadow-neu-inset-sm overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{
                  width: lowStockItems.length > 0
                    ? `${(checkedItems.size / lowStockItems.length) * 100}%`
                    : '0%'
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Shopping Items */}
      {lowStockItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full shadow-neu-inset mb-4">
            <ShoppingCart className="h-8 w-8 text-stock-good" />
          </div>
          <h3 className="text-lg font-medium">All stocked up!</h3>
          <p className="text-muted-foreground mt-1">
            No items need restocking right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockItems.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "relative animate-fade-in transition-all duration-200",
                checkedItems.has(item.id) && "opacity-60"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-3 items-start">
                <Button
                  variant={checkedItems.has(item.id) ? "default" : "outline"}
                  size="icon"
                  className="shrink-0 mt-4"
                  onClick={() => toggleItem(item.id)}
                >
                  {checkedItems.has(item.id) && <Check className="h-4 w-4" />}
                </Button>

                <div className={cn(
                  "flex-1",
                  checkedItems.has(item.id) && "line-through decoration-2"
                )}>
                  <ItemCard item={item} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
