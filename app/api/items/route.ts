import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.select().from(items).orderBy(desc(items.createdAt));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();

  const [row] = await db
    .insert(items)
    .values({
      name: body.name,
      brand: body.brand,
      category: body.category,
      quantity: body.quantity,
      minQuantity: body.minQuantity,
      status: body.status,
      size: body.size,
      price: body.price,
      purchaseDate: body.purchaseDate,
      openedDate: body.openedDate,
      expiryDate: body.expiryDate,
      notes: body.notes,
      imageUrl: body.imageUrl,
      isTravelEssential: body.isTravelEssential ?? false,
      travelQuantity: body.travelQuantity,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
