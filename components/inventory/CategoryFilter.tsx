import { ItemCategory, CATEGORIES } from '@/types/inventory';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from './CategoryIcon';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryFilterProps {
  selected: ItemCategory | 'all';
  onSelect: (category: ItemCategory | 'all') => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        <Button
          variant={selected === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect('all')}
          className="shrink-0"
        >
          All Items
        </Button>
        
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={selected === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(cat.id)}
            className="shrink-0 gap-2"
          >
            <CategoryIcon category={cat.id} size="sm" className="!p-0 !h-4 !w-4 !shadow-none bg-transparent" />
            <span className="hidden sm:inline">{cat.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="h-2" />
    </ScrollArea>
  );
}
