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
  toiletries: 'text-blue-600 dark:text-blue-400',
  skincare: 'text-pink-600 dark:text-pink-400',
  haircare: 'text-purple-600 dark:text-purple-400',
  dental: 'text-cyan-600 dark:text-cyan-400',
  cleaning: 'text-emerald-600 dark:text-emerald-400',
  grocery: 'text-amber-600 dark:text-amber-400',
  snacks: 'text-orange-600 dark:text-orange-400',
  beverages: 'text-rose-600 dark:text-rose-400',
  medicine: 'text-red-600 dark:text-red-400',
  other: 'text-slate-600 dark:text-slate-400',
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
      'rounded-xl flex items-center justify-center shadow-neu-inset-sm shrink-0',
      sizeClasses[size],
      colorMap[category],
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}
