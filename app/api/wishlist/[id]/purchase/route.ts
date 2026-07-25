import { db } from '@/lib/db';
import { items, wishlistItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// Note: the neon-http driver doesn't support multi-statement transactions,
// so this is two sequential writes rather than one atomic operation — fine
// for a personal-inventory app at this scale.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [wishlistItem] = await db.select().from(wishlistItems).where(eq(wishlistItems.id, id));
  if (!wishlistItem) {
    return Response.json({ error: 'Wishlist item not found' }, { status: 404 });
  }

  const [newItem] = await db
    .insert(items)
    .values({
      name: wishlistItem.name,
      brand: wishlistItem.brand,
      category: wishlistItem.category,
      quantity: 1,
      minQuantity: 1,
      status: 'new',
      price: wishlistItem.estimatedPrice,
      purchaseDate: new Date().toISOString().split('T')[0],
    })
    .returning();

  await db.delete(wishlistItems).where(eq(wishlistItems.id, id));

  return Response.json(newItem, { status: 201 });
}
