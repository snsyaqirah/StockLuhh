import { db } from '@/lib/db';
import { travelKits } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const [row] = await db
    .update(travelKits)
    .set(updates)
    .where(eq(travelKits.id, id))
    .returning();

  if (!row) {
    return Response.json({ error: 'Travel kit not found' }, { status: 404 });
  }

  return Response.json(row);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [row] = await db.delete(travelKits).where(eq(travelKits.id, id)).returning();

  if (!row) {
    return Response.json({ error: 'Travel kit not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
