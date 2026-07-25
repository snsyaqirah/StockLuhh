import { InventoryItem } from '@/types/inventory';
import { Card } from '@/components/ui/card';
import { ItemCard } from '@/components/inventory/ItemCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentItemsProps {
  items: InventoryItem[];
  title: string;
  emptyMessage: string;
  viewAllLink: string;
}

export function RecentItems({ items, title, emptyMessage, viewAllLink }: RecentItemsProps) {
  return (
    <Card className="p-4 gradient-card shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <Link to={viewAllLink}>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
      
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 3).map((item, index) => (
            <div 
              key={item.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
