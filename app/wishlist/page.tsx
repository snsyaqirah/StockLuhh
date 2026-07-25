'use client';

import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Star, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { CategoryIcon } from '@/components/inventory/CategoryIcon';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ItemCategory, CATEGORIES, PRIORITY_CONFIG } from '@/types/inventory';

export default function Wishlist() {
  const { wishlist, addToWishlist, removeFromWishlist, moveWishlistToInventory } = useInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', brand: '', category: 'other' as ItemCategory, estimatedPrice: '', priority: 'medium' as 'low' | 'medium' | 'high', notes: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addToWishlist({ ...formData, estimatedPrice: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : undefined });
    setFormData({ name: '', brand: '', category: 'other', estimatedPrice: '', priority: 'medium', notes: '' });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Wishlist</h1>
          <p className="text-muted-foreground">{wishlist.length} items you want to try</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Add to Wishlist</Button></DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add to Wishlist</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Product Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required maxLength={100} /></div>
              <div className="space-y-2"><Label>Brand</Label><Input value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} maxLength={50} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v as ItemCategory})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map((cat) => (<SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Priority</Label><Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v as 'low'|'medium'|'high'})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label>Est. Price (RM)</Label><Input type="number" step="0.01" min="0" value={formData.estimatedPrice} onChange={(e) => setFormData({...formData, estimatedPrice: e.target.value})} /></div>
              <div className="space-y-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows={2} maxLength={500} /></div>
              <div className="flex gap-3 pt-4"><Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="flex-1">Add</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16"><div className="inline-flex items-center justify-center h-16 w-16 rounded-full shadow-neu-inset mb-4"><Heart className="h-8 w-8 text-accent" /></div><h3 className="text-lg font-medium">Your wishlist is empty</h3><p className="text-muted-foreground mt-1">Save products you want to try next</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item, index) => (
            <Card key={item.id} className="p-4 gradient-card shadow-card border border-border/50 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-start gap-3">
                <CategoryIcon category={item.category} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  {item.brand && <p className="text-sm text-muted-foreground">{item.brand}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className={PRIORITY_CONFIG[item.priority].color}>{PRIORITY_CONFIG[item.priority].label}</Badge>
                    {item.estimatedPrice && <span className="text-sm text-muted-foreground">~RM{item.estimatedPrice.toFixed(2)}</span>}
                  </div>
                  {item.rating && <div className="mt-2 flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= item.rating! ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />)}</div>}
                  {item.notes && <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.notes}</p>}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="soft" className="gap-1 flex-1" onClick={() => moveWishlistToInventory(item)}><ShoppingCart className="h-3 w-3" />Buy</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFromWishlist(item.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
