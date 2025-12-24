import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useInventory } from '@/hooks/useInventory';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Check, Plus, Trash2, MapPin, Calendar } from 'lucide-react';
import { CategoryIcon } from '@/components/inventory/CategoryIcon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function TravelMode() {
  const { travelKits, generateTravelKit, toggleTravelItemPacked, deleteTravelKit, travelEssentials } = useInventory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', destination: '', tripDate: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    generateTravelKit(formData.name || 'New Trip', formData.destination, formData.tripDate);
    setFormData({ name: '', destination: '', tripDate: '' });
    setDialogOpen(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold">Travel Mode</h1>
            <p className="text-muted-foreground">{travelEssentials.length} travel essentials marked</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />New Travel Kit</Button></DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Create Travel Kit</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Trip Name *</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Weekend Getaway" required maxLength={50} /></div>
                <div className="space-y-2"><Label>Destination</Label><Input value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} placeholder="Beach Resort" maxLength={50} /></div>
                <div className="space-y-2"><Label>Trip Date</Label><Input type="date" value={formData.tripDate} onChange={(e) => setFormData({...formData, tripDate: e.target.value})} /></div>
                <p className="text-sm text-muted-foreground">This will include {travelEssentials.length} items marked as travel essentials.</p>
                <div className="flex gap-3 pt-4"><Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" className="flex-1">Create Kit</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {travelKits.length === 0 ? (
          <div className="text-center py-16"><div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/15 mb-4"><Plane className="h-8 w-8 text-accent" /></div><h3 className="text-lg font-medium">No travel kits yet</h3><p className="text-muted-foreground mt-1">Create a packing list for your next trip</p></div>
        ) : (
          <div className="space-y-6">
            {travelKits.map((kit) => {
              const packedCount = kit.items.filter(i => i.packed).length;
              const progress = kit.items.length > 0 ? (packedCount / kit.items.length) * 100 : 0;
              return (
                <Card key={kit.id} className="p-5 gradient-card shadow-card border border-border/50">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{kit.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                        {kit.destination && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{kit.destination}</span>}
                        {kit.tripDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(kit.tripDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => deleteTravelKit(kit.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </div>
                  <div className="mb-4"><div className="flex justify-between text-sm mb-1"><span>{packedCount} of {kit.items.length} packed</span><span>{Math.round(progress)}%</span></div><div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>
                  <div className="space-y-2">
                    {kit.items.map((item) => (
                      <div key={item.itemId} className={cn("flex items-center gap-3 p-2 rounded-lg transition-all", item.packed ? "bg-primary/5" : "bg-secondary/50")} onClick={() => toggleTravelItemPacked(kit.id, item.itemId)}>
                        <Button variant={item.packed ? "default" : "outline"} size="icon-sm" className="shrink-0">{item.packed && <Check className="h-4 w-4" />}</Button>
                        <CategoryIcon category={item.category} size="sm" />
                        <span className={cn("flex-1", item.packed && "line-through text-muted-foreground")}>{item.itemName}</span>
                        <span className="text-sm text-muted-foreground">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
