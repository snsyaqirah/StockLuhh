'use client';

import { useState } from 'react';
import { ItemCard } from '@/components/inventory/ItemCard';
import { CategoryFilter } from '@/components/inventory/CategoryFilter';
import { AddItemDialog } from '@/components/inventory/AddItemDialog';
import { EditItemDialog } from '@/components/inventory/EditItemDialog';
import { DeleteConfirmDialog } from '@/components/inventory/DeleteConfirmDialog';
import { useInventory } from '@/hooks/useInventory';
import { ItemCategory, InventoryItem } from '@/types/inventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Undo2 } from 'lucide-react';

export default function Inventory() {
  const { items, addItem, updateItem, deleteItem, logUsage, getItemsByCategory, undoLastAction, canUndo } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteItemData, setDeleteItemData] = useState<InventoryItem | null>(null);

  const filteredItems = getItemsByCategory(selectedCategory).filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + delta);
      let newStatus = item.status;
      if (newQuantity === 0) newStatus = 'finished';
      else if (newQuantity <= item.minQuantity) newStatus = 'low';
      else if (item.status === 'finished' || item.status === 'low') newStatus = 'in-use';
      updateItem(id, { quantity: newQuantity, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">{items.length} items in your collection</p>
        </div>
        <div className="flex gap-2">
          {canUndo && (
            <Button variant="outline" size="sm" onClick={undoLastAction} className="gap-2">
              <Undo2 className="h-4 w-4" /> Undo
            </Button>
          )}
          <AddItemDialog onAdd={addItem} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full shadow-neu-inset mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No items found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery || selectedCategory !== 'all' ? 'Try adjusting your filters' : 'Add your first item to get started'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <ItemCard
                item={item}
                onEdit={setEditItem}
                onDelete={setDeleteItemData}
                onUpdateQuantity={handleUpdateQuantity}
                onLogUsage={logUsage}
                showUsageButtons={true}
              />
            </div>
          ))}
        </div>
      )}

      <EditItemDialog item={editItem} open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)} onSave={updateItem} />
      <DeleteConfirmDialog
        open={!!deleteItemData}
        onOpenChange={(open) => !open && setDeleteItemData(null)}
        onConfirm={() => { deleteItem(deleteItemData!.id); setDeleteItemData(null); }}
        itemName={deleteItemData?.name || ''}
      />
    </div>
  );
}
