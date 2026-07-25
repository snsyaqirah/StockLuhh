import Link from 'next/link';
import { Package } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-neu-inset">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">This page wandered off the shelf.</p>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-neu-flat transition-all duration-300 ease-out hover:shadow-neu-flat-hover hover:-translate-y-px active:translate-y-px"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
