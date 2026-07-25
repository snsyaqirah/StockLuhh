import { db } from '@/lib/db';
import { wishlistItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const [row] = await db
    .update(wishlistItems)
    .set(updates)
    .where(eq(wishlistItems.id, id))
    .returning();

  if (!row) {
    return Response.json({ error: 'Wishlist item not found' }, { status: 404 });
  }

  return Response.json(row);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [row] = await db.delete(wishlistItems).where(eq(wishlistItems.id, id)).returning();

  if (!row) {
    return Response.json({ error: 'Wishlist item not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
