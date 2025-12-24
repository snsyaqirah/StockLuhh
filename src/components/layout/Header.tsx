import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, Menu, X, BarChart3, Heart, Plane, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/shopping', label: 'Shopping', icon: ShoppingCart },
  { path: '/expiry', label: 'Expiry', icon: Calendar },
  { path: '/travel', label: 'Travel', icon: Plane },
  { path: '/wishlist', label: 'Wishlist', icon: Heart },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Stockee</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button variant={isActive ? "soft" : "ghost"} size="sm" className={cn("gap-2", isActive && "font-semibold")}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/50 bg-background animate-fade-in">
          <nav className="container py-4 grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant={isActive ? "soft" : "ghost"} className={cn("w-full justify-start gap-2", isActive && "font-semibold")}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
