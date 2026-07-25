/**
 * Header Component
 * Top navigation with logo, desktop nav, and dark mode toggle
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Menu,
  X,
  BarChart3,
  Heart,
  Plane,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';
import { useTheme } from 'next-themes';
import { useUserPreferences } from '@/hooks/useUserPreferences';

// Icon mapping for dynamic rendering
const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Calendar,
  Plane,
  Heart,
  BarChart3,
};

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { mode, setMode } = useUserPreferences();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-neu-sm transition-transform group-hover:scale-105">
            <Package className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">StockLuhh</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "soft" : "ghost"}
                  size="sm"
                  className={cn("gap-2", isActive && "font-semibold")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Mode selector */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-medium">
              <span className={cn(
                "w-2 h-2 rounded-full",
                mode === 'simple' && "bg-green-500",
                mode === 'smart' && "bg-blue-500",
                mode === 'power' && "bg-purple-500"
              )} />
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover rounded-2xl shadow-neu-flat-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="p-2 space-y-1">
                <p className="text-xs text-muted-foreground px-2 py-1">App Mode</p>
                {(['simple', 'smart', 'power'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded-xl text-sm flex items-center gap-2 hover:bg-accent/15",
                      mode === m && "shadow-neu-inset-sm"
                    )}
                  >
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      m === 'simple' && "bg-green-500",
                      m === 'smart' && "bg-blue-500",
                      m === 'power' && "bg-purple-500"
                    )} />
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-background shadow-neu-sm animate-fade-in">
          <nav className="container py-4 grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "soft" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      isActive && "font-semibold"
                    )}
                  >
                    <Icon className="h-5 w-5" />
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
