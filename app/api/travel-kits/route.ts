import { db } from '@/lib/db';
import { travelKits } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await db.select().from(travelKits).orderBy(desc(travelKits.createdAt));
  return Response.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();

  const [row] = await db
    .insert(travelKits)
    .values({
      name: body.name,
      destination: body.destination,
      tripDate: body.tripDate,
      createdDate: new Date().toISOString().split('T')[0],
      items: body.items ?? [],
    })
    .returning();

  return Response.json(row, { status: 201 });
}
