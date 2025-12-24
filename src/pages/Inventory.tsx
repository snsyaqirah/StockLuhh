import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ItemCard } from '@/components/inventory/ItemCard';
import { CategoryFilter } from '@/components/inventory/CategoryFilter';
import { AddItemDialog } from '@/components/inventory/AddItemDialog';
import { useInventory } from '@/hooks/useInventory';
import { ItemCategory } from '@/types/inventory';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';

export default function Inventory() {
  const { items, addItem, getItemsByCategory } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = getItemsByCategory(selectedCategory).filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">
              {items.length} items in your collection
            </p>
          </div>
          <AddItemDialog onAdd={addItem} />
        </div>

        {/* Search & Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No items found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Add your first item to get started'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
