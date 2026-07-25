import { 
  Droplets, 
  Sparkles, 
  Wind, 
  Smile, 
  SprayCan, 
  ShoppingBasket, 
  Cookie, 
  Coffee, 
  Pill, 
  Package 
} from 'lucide-react';
import { ItemCategory } from '@/types/inventory';
import { cn } from '@/lib/utils';

const iconMap = {
  toiletries: Droplets,
  skincare: Sparkles,
  haircare: Wind,
  dental: Smile,
  cleaning: SprayCan,
  grocery: ShoppingBasket,
  snacks: Cookie,
  beverages: Coffee,
  medicine: Pill,
  other: Package,
};

const colorMap: Record<ItemCategory, string> = {
  toiletries: 'bg-blue-100 text-blue-600',
  skincare: 'bg-pink-100 text-pink-600',
  haircare: 'bg-purple-100 text-purple-600',
  dental: 'bg-cyan-100 text-cyan-600',
  cleaning: 'bg-emerald-100 text-emerald-600',
  grocery: 'bg-amber-100 text-amber-600',
  snacks: 'bg-orange-100 text-orange-600',
  beverages: 'bg-rose-100 text-rose-600',
  medicine: 'bg-red-100 text-red-600',
  other: 'bg-slate-100 text-slate-600',
};

interface CategoryIconProps {
  category: ItemCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIcon({ category, size = 'md', className }: CategoryIconProps) {
  const Icon = iconMap[category];
  
  const sizeClasses = {
    sm: 'h-6 w-6 p-1',
    md: 'h-8 w-8 p-1.5',
    lg: 'h-10 w-10 p-2',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn(
      'rounded-lg flex items-center justify-center',
      sizeClasses[size],
      colorMap[category],
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}
