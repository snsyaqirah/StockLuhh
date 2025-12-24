import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ItemCategory, ItemStatus, CATEGORIES, InventoryItem } from '@/types/inventory';
import { CategoryIcon } from './CategoryIcon';

interface EditItemDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<InventoryItem>) => void;
}

export function EditItemDialog({ item, open, onOpenChange, onSave }: EditItemDialogProps) {
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
    notes: '',
    isTravelEssential: false,
    travelQuantity: 1,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        brand: item.brand || '',
        category: item.category,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
        status: item.status,
        size: item.size || '',
        price: item.price?.toString() || '',
        expiryDate: item.expiryDate || '',
        notes: item.notes || '',
        isTravelEssential: item.isTravelEssential || false,
        travelQuantity: item.travelQuantity || 1,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    onSave(item.id, {
      name: formData.name.trim(),
      brand: formData.brand.trim() || undefined,
      category: formData.category,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      status: formData.status,
      size: formData.size.trim() || undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      expiryDate: formData.expiryDate || undefined,
      notes: formData.notes.trim() || undefined,
      isTravelEssential: formData.isTravelEssential,
      travelQuantity: formData.travelQuantity,
    });
    
    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Item Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cetaphil Cleanser"
              maxLength={100}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-brand">Brand</Label>
            <Input
              id="edit-brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g., Cetaphil"
              maxLength={50}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData({ ...formData, category: v as ItemCategory })}
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
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0"
                max="9999"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-minQuantity">Low Stock Alert</Label>
              <Input
                id="edit-minQuantity"
                type="number"
                min="0"
                max="9999"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-size">Size</Label>
              <Input
                id="edit-size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., 500ml"
                maxLength={20}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (RM)</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                min="0"
                max="99999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-expiryDate">Expiry Date</Label>
            <Input
              id="edit-expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              maxLength={500}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div>
              <Label htmlFor="travel-essential" className="font-medium">Travel Essential</Label>
              <p className="text-xs text-muted-foreground">Include in travel kits</p>
            </div>
            <Switch
              id="travel-essential"
              checked={formData.isTravelEssential}
              onCheckedChange={(checked) => setFormData({ ...formData, isTravelEssential: checked })}
            />
          </div>

          {formData.isTravelEssential && (
            <div className="space-y-2">
              <Label htmlFor="travel-quantity">Travel Quantity</Label>
              <Input
                id="travel-quantity"
                type="number"
                min="1"
                max="99"
                value={formData.travelQuantity}
                onChange={(e) => setFormData({ ...formData, travelQuantity: parseInt(e.target.value) || 1 })}
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
