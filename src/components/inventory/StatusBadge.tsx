import { Badge } from '@/components/ui/badge';
import { ItemStatus, STATUS_CONFIG } from '@/types/inventory';

interface StatusBadgeProps {
  status: ItemStatus;
  className?: string;
}

const variantMap: Record<ItemStatus, 'stock-full' | 'stock-good' | 'stock-low' | 'stock-empty'> = {
  'new': 'stock-full',
  'in-use': 'stock-good',
  'low': 'stock-low',
  'finished': 'stock-empty',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge variant={variantMap[status]} className={className}>
      {config.label}
    </Badge>
  );
}
