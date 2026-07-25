/**
 * Empty State Component
 * Reusable component for empty/no-data states
 */

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    children?: ReactNode;
    iconClassName?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    children,
    iconClassName,
}: EmptyStateProps) {
    return (
        <div className={cn('text-center py-12 px-4', className)}>
            <div
                className={cn(
                    'inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary mb-4',
                    iconClassName
                )}
            >
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
            {description && (
                <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                    {description}
                </p>
            )}
            {action && (
                <Button onClick={action.onClick} className="mt-4">
                    {action.label}
                </Button>
            )}
            {children}
        </div>
    );
}
