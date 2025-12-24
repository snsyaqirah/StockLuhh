import { InventoryItem } from '@/types/inventory';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar, DollarSign, Edit, Trash2, Plane, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';

interface ItemCardProps {
  item: InventoryItem;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onUpdateQuantity?: (id: string, delta: number) => void;
  className?: string;
  showActions?: boolean;
}

export function ItemCard({ 
  item, 
  onEdit, 
  onDelete, 
  onUpdateQuantity,
  className,
  showActions = true 
}: ItemCardProps) {
  const isExpiringSoon = item.expiryDate && differenceInDays(new Date(item.expiryDate), new Date()) <= 30;
  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
  
  return (
    <Card className={cn(
      "p-4 gradient-card shadow-card hover:shadow-elevated transition-all duration-200 group",
      "border border-border/50 hover:border-border",
      isExpired && "border-stock-expired/30 bg-stock-expired/5",
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
            
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Item
                  </DropdownMenuItem>
                  {item.isTravelEssential && (
                    <DropdownMenuItem disabled>
                      <Plane className="h-4 w-4 mr-2" />
                      Travel Essential
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(item)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Item
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            
            {item.isTravelEssential && (
              <span className="inline-flex items-center gap-1 text-xs bg-accent/15 text-accent px-2 py-0.5 rounded-full">
                <Plane className="h-3 w-3" />
                Travel
              </span>
            )}
            
            {isExpired && (
              <span className="inline-flex items-center gap-1 text-xs bg-stock-expired/15 text-stock-expired px-2 py-0.5 rounded-full font-medium">
                Expired
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center gap-2">
            {onUpdateQuantity && (
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-md"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-md"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {!onUpdateQuantity && (
              <span className="text-sm text-muted-foreground">
                Qty: <span className="font-medium text-foreground">{item.quantity}</span>
              </span>
            )}
            
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
                isExpired && "text-stock-expired font-medium",
                isExpiringSoon && !isExpired && "text-stock-low font-medium"
              )}>
                <Calendar className="h-3 w-3" />
                {isExpired ? 'Expired: ' : 'Exp: '}{format(new Date(item.expiryDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>

          {item.notes && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 italic">
              {item.notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
