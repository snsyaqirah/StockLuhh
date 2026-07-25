import { db } from '@/lib/db';
import { items } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface BatchUpdate {
  id: string;
  changes: Partial<typeof items.$inferInsert>;
}

export async function PATCH(request: Request) {
  const updates: BatchUpdate[] = await request.json();

  const updated = await Promise.all(
    updates.map(({ id, changes }) =>
      db
        .update(items)
        .set({ ...changes, updatedAt: new Date() })
        .where(eq(items.id, id))
        .returning()
        .then((rows) => rows[0])
    )
  );

  return Response.json(updated.filter(Boolean));
}
