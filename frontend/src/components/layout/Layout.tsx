import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen gradient-warm">
      <Header />
      <main className="container py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
