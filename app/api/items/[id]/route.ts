import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const [row] = await db
    .update(items)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(items.id, id))
    .returning();

  if (!row) {
    return Response.json({ error: 'Item not found' }, { status: 404 });
  }

  return Response.json(row);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [row] = await db.delete(items).where(eq(items.id, id)).returning();

  if (!row) {
    return Response.json({ error: 'Item not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
