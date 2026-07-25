import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.');
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
});
