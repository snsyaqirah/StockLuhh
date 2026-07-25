import { db } from '@/lib/db';
import { items, travelKits } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import type { TravelKitItem } from '@/types/inventory';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { name, destination, tripDate }: { name: string; destination?: string; tripDate?: string } =
    await request.json();

  const essentials = await db
    .select()
    .from(items)
    .where(and(eq(items.isTravelEssential, true), gt(items.quantity, 0)));

  const kitItems: TravelKitItem[] = essentials.map((item) => ({
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    quantity: item.travelQuantity || 1,
    packed: false,
  }));

  const [row] = await db
    .insert(travelKits)
    .values({
      name: name || 'New Trip',
      destination,
      tripDate,
      createdDate: new Date().toISOString().split('T')[0],
      items: kitItems,
    })
    .returning();

  return Response.json(row, { status: 201 });
}
