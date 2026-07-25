'use client';

/**
 * Bottom Navigation Component
 * Mobile-first navigation for PWA feel
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Calendar,
    BarChart3,
    MoreHorizontal,
    Heart,
    Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BOTTOM_NAV_ITEMS } from '@/lib/constants';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const iconMap = {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Calendar,
    BarChart3,
};

const moreItems = [
    { path: '/travel', label: 'Travel Mode', icon: Plane },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50',
                'bg-background shadow-[0_-8px_20px_-6px_rgb(var(--neu-shadow-dark)/0.35)]',
                'pb-safe', // For iOS safe area
                'lg:hidden' // Hide on desktop
            )}
        >
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {BOTTOM_NAV_ITEMS.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap];
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                                'transition-all duration-200 ease-out',
                                'active:scale-95',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <div className={cn(
                                'relative p-1.5 rounded-xl transition-all duration-200',
                                isActive && 'shadow-neu-inset-sm'
                            )}>
                                <Icon className={cn(
                                    'h-5 w-5 transition-transform duration-200',
                                    isActive && 'scale-110'
                                )} />
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </div>
                            <span className={cn(
                                'text-[10px] font-medium',
                                isActive && 'font-semibold'
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}

                {/* More menu for additional items */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                                'transition-all duration-200 ease-out',
                                'text-muted-foreground hover:text-foreground',
                                'active:scale-95',
                                moreItems.some(i => pathname === i.path) && 'text-primary'
                            )}
                        >
                            <div className={cn(
                                'p-1.5 rounded-xl transition-all duration-200',
                                moreItems.some(i => pathname === i.path) && 'shadow-neu-inset-sm'
                            )}>
                                <MoreHorizontal className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-medium">More</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 mb-2">
                        {moreItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <DropdownMenuItem key={item.path} asChild>
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            'flex items-center gap-2 cursor-pointer',
                                            isActive && 'bg-primary/10 text-primary'
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
