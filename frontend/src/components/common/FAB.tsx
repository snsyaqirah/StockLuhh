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

    // Don't show FAB on certain pages
    const hiddenPaths = ['/inventory'];
    if (hiddenPaths.includes(location.pathname)) return null;

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
            color: 'bg-blue-500 hover:bg-blue-600',
            action: () => navigate('/shopping')
        },
        {
            icon: Plane,
            label: 'Travel',
            color: 'bg-purple-500 hover:bg-purple-600',
            action: () => navigate('/travel')
        },
        {
            icon: Calendar,
            label: 'Expiry',
            color: 'bg-orange-500 hover:bg-orange-600',
            action: () => navigate('/expiry')
        },
    ];

    return (
        <>
            {/* Backdrop */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
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
                        <span className="bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
                            {action.label}
                        </span>
                        <Button
                            size="icon"
                            className={cn("h-12 w-12 rounded-full shadow-lg", action.color)}
                            onClick={() => {
                                action.action();
                                setIsExpanded(false);
                            }}
                        >
                            <action.icon className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Main FAB - Mobile only */}
            <Button
                size="icon"
                className={cn(
                    "fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-elevated transition-all duration-200 lg:hidden",
                    isExpanded
                        ? "bg-muted-foreground rotate-45"
                        : "bg-primary hover:bg-primary/90 active:scale-95"
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
