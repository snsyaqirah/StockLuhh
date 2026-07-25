import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { UsageRecord, ItemStatus } from '@/types/inventory';

export const dynamic = 'force-dynamic';

type UsageType = 'once' | 'half' | 'daily' | 'finished';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { type }: { type: UsageType } = await request.json();

  const [item] = await db.select().from(items).where(eq(items.id, id));
  if (!item) {
    return Response.json({ error: 'Item not found' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const usageRecord: UsageRecord = {
    id: crypto.randomUUID(),
    action: type,
    date: now,
    quantityUsed: type === 'half' ? 0.5 : 1,
  };
  const newHistory = [...(item.usageHistory || []), usageRecord];

  let newQuantity = item.quantity;
  let newStatus: ItemStatus = item.status;

  if (type === 'finished') {
    newQuantity = 0;
    newStatus = 'finished';
  } else if (type === 'half') {
    newQuantity = Math.max(0, item.quantity - 0.5);
    if (newQuantity <= item.minQuantity) newStatus = 'low';
  } else if (type === 'once') {
    newQuantity = Math.max(0, item.quantity - 1);
    if (newQuantity === 0) newStatus = 'finished';
    else if (newQuantity <= item.minQuantity) newStatus = 'low';
  }
  // 'daily' just logs without changing quantity

  // Calculate average lifespan from usage history
  let avgLifespan = item.averageLifespanDays;
  if (newHistory.length >= 2 && item.openedDate) {
    const opened = new Date(item.openedDate).getTime();
    const lastUsed = new Date(newHistory[newHistory.length - 1].date).getTime();
    const daysSinceOpened = Math.max(1, Math.round((lastUsed - opened) / (1000 * 60 * 60 * 24)));
    avgLifespan = Math.round((daysSinceOpened / newHistory.length) * item.quantity);
  }

  const [updated] = await db
    .update(items)
    .set({
      quantity: newQuantity,
      status: newStatus,
      usageHistory: newHistory,
      averageLifespanDays: avgLifespan,
      openedDate: item.openedDate || (type !== 'daily' ? now.split('T')[0] : item.openedDate),
      updatedAt: new Date(),
    })
    .where(eq(items.id, id))
    .returning();

  return Response.json(updated);
}
