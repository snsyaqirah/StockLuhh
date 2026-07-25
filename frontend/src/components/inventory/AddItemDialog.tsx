import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ItemCategory, ItemStatus, CATEGORIES, InventoryItem } from '@/types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface AddItemDialogProps {
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  trigger?: React.ReactNode;
}

export function AddItemDialog({ onAdd, trigger }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'other' as ItemCategory,
    quantity: 1,
    minQuantity: 1,
    status: 'new' as ItemStatus,
    size: '',
    price: '',
    expiryDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onAdd({
      name: formData.name,
      brand: formData.brand || undefined,
      category: formData.category,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      status: formData.status,
      size: formData.size || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      expiryDate: formData.expiryDate || undefined,
      purchaseDate: new Date().toISOString().split('T')[0],
    });

    setFormData({
      name: '',
      brand: '',
      category: 'other',
      quantity: 1,
      minQuantity: 1,
      status: 'new',
      size: '',
      price: '',
      expiryDate: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 shadow-soft">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cetaphil Cleanser"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g., Cetaphil"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => {
                  const category = v as ItemCategory;
                  // Smart defaults based on category
                  const expiryDays: Record<ItemCategory, number> = {
                    grocery: 7,
                    snacks: 30,
                    beverages: 14,
                    medicine: 365,
                    toiletries: 180,
                    skincare: 180,
                    haircare: 180,
                    dental: 180,
                    cleaning: 365,
                    other: 0,
                  };

                  // Calculate default expiry date
                  let defaultExpiry = formData.expiryDate;
                  if (!formData.expiryDate && expiryDays[category] > 0) {
                    const date = new Date();
                    date.setDate(date.getDate() + expiryDays[category]);
                    defaultExpiry = date.toISOString().split('T')[0];
                  }

                  setFormData({
                    ...formData,
                    category,
                    expiryDate: defaultExpiry,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={cat.id} size="sm" className="!p-0 !h-4 !w-4" />
                        {cat.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as ItemStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="low">Running Low</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minQuantity">Low Stock Alert</Label>
              <Input
                id="minQuantity"
                type="number"
                min="0"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 500ml"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (RM)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
