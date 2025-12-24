import { InventoryItem } from '@/types/inventory';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

interface ItemCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  className?: string;
}

export function ItemCard({ item, onEdit, className }: ItemCardProps) {
  const isExpiringSoon = item.expiryDate && differenceInDays(new Date(item.expiryDate), new Date()) <= 30;
  
  return (
    <Card className={cn(
      "p-4 gradient-card shadow-card hover:shadow-elevated transition-all duration-200 group",
      "border border-border/50 hover:border-border",
      className
    )}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={item.category} size="lg" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
              {item.brand && (
                <p className="text-sm text-muted-foreground truncate">{item.brand}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={() => onEdit?.(item)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            
            <span className="text-sm text-muted-foreground">
              Qty: <span className="font-medium text-foreground">{item.quantity}</span>
            </span>
            
            {item.size && (
              <span className="text-sm text-muted-foreground">
                • {item.size}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {item.price && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                RM{item.price.toFixed(2)}
              </span>
            )}
            
            {item.expiryDate && (
              <span className={cn(
                "flex items-center gap-1",
                isExpiringSoon && "text-stock-low font-medium"
              )}>
                <Calendar className="h-3 w-3" />
                Exp: {format(new Date(item.expiryDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
