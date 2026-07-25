import { db } from '@/lib/db';
import { wishlistItems } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.select().from(wishlistItems).orderBy(desc(wishlistItems.createdAt));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();

  const [row] = await db
    .insert(wishlistItems)
    .values({
      name: body.name,
      brand: body.brand,
      category: body.category,
      estimatedPrice: body.estimatedPrice,
      priority: body.priority ?? 'medium',
      notes: body.notes,
      addedDate: new Date().toISOString().split('T')[0],
      productUrl: body.productUrl,
      rating: body.rating,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
