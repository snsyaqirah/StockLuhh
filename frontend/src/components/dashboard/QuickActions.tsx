import { Plus, ShoppingCart, Package, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AddItemDialog } from '@/components/inventory/AddItemDialog';
import { Link } from 'react-router-dom';
import { InventoryItem } from '@/types/inventory';

interface QuickActionsProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  lowStockCount: number;
}

export function QuickActions({ onAddItem, lowStockCount }: QuickActionsProps) {
  return (
    <Card className="p-4 gradient-card shadow-card border border-border/50">
      <h3 className="font-semibold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        <AddItemDialog
          onAdd={onAddItem}
          trigger={
            <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 w-full">
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add Item</span>
            </Button>
          }
        />

        <Link to="/shopping">
          <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 w-full relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-xs">Shopping</span>
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-stock-low text-[10px] font-bold flex items-center justify-center text-white">
                {lowStockCount}
              </span>
            )}
          </Button>
        </Link>

        <Link to="/inventory">
          <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 w-full">
            <Package className="h-5 w-5" />
            <span className="text-xs">Inventory</span>
          </Button>
        </Link>

        <Link to="/travel">
          <Button variant="outline" className="h-auto py-3 flex-col gap-1.5 w-full">
            <Plane className="h-5 w-5" />
            <span className="text-xs">Travel</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
