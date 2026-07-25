import { db } from '@/lib/db';
import { travelKits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;

  const [kit] = await db.select().from(travelKits).where(eq(travelKits.id, id));
  if (!kit) {
    return Response.json({ error: 'Travel kit not found' }, { status: 404 });
  }

  const updatedItems = kit.items.map((item) =>
    item.itemId === itemId ? { ...item, packed: !item.packed } : item
  );

  const [row] = await db
    .update(travelKits)
    .set({ items: updatedItems })
    .where(eq(travelKits.id, id))
    .returning();

  return Response.json(row);
}
