/**
 * Floating Action Button (FAB) with contextual quick actions
 * - Short tap: Navigate to Add Item
 * - Long press: Show quick action menu
 */

import { useState, useRef, useCallback } from 'react';
import { Plus, ShoppingCart, Plane, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

export function FAB() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    // Pages where FAB should be hidden
    const hiddenPaths = ['/inventory'];
    const shouldHide = hiddenPaths.includes(location.pathname);

    const handlePressStart = useCallback(() => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setIsExpanded(true);
        }, 400);
    }, []);

    const handlePressEnd = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (!isLongPress.current && !isExpanded) {
            navigate('/inventory?action=add');
        }
    }, [isExpanded, navigate]);

    const quickActions = [
        {
            icon: ShoppingCart,
            label: 'Shopping',
            iconColor: 'text-primary',
            action: () => navigate('/shopping')
        },
        {
            icon: Plane,
            label: 'Travel',
            iconColor: 'text-accent-foreground',
            action: () => navigate('/travel')
        },
        {
            icon: Calendar,
            label: 'Expiry',
            iconColor: 'text-stock-low',
            action: () => navigate('/expiry')
        },
    ];

    if (shouldHide) return null;

    return (
        <>
            {/* Backdrop */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            {/* Quick Actions */}
            <div className="fixed bottom-24 right-4 z-50 flex flex-col-reverse gap-3 lg:hidden">
                {isExpanded && quickActions.map((action, index) => (
                    <div
                        key={action.label}
                        className="flex items-center gap-2 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <span className="bg-background px-3 py-1.5 rounded-xl text-sm font-medium shadow-neu-sm">
                            {action.label}
                        </span>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-12 w-12"
                            onClick={() => {
                                action.action();
                                setIsExpanded(false);
                            }}
                        >
                            <action.icon className={cn("h-5 w-5", action.iconColor)} />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Main FAB - Mobile only */}
            <Button
                size="icon"
                className={cn(
                    "fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-neu-flat-hover transition-all duration-300 lg:hidden",
                    isExpanded && "bg-destructive rotate-45"
                )}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={() => longPressTimer.current && clearTimeout(longPressTimer.current)}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
            >
                {isExpanded ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Plus className="h-6 w-6" />
                )}
            </Button>
        </>
    );
}
