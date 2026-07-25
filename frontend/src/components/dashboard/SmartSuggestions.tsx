import { getSmartSuggestions, SmartSuggestion } from '@/lib/smart-suggestions';
import { InventoryItem } from '@/types/inventory';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, X, Lightbulb } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface SmartSuggestionsProps {
    items: InventoryItem[];
}

export function SmartSuggestions({ items }: SmartSuggestionsProps) {
    const navigate = useNavigate();
    const [dismissed, setDismissed] = useState<string[]>([]);

    const suggestions = useMemo(() =>
        getSmartSuggestions(items).filter(s => !dismissed.includes(s.id)),
        [items, dismissed]);

    const handleDismiss = (id: string) => {
        setDismissed(prev => [...prev, id]);
    };

    const handleAction = (suggestion: SmartSuggestion) => {
        if (suggestion.type === 'low_stock' || suggestion.type === 'usage_prediction') {
            navigate('/shopping');
        } else if (suggestion.type === 'expiring') {
            navigate('/expiry');
        }
    };

    if (suggestions.length === 0) return null;

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-lg">Smart Suggestions</h3>
            </div>

            <div className="grid gap-3">
                {suggestions.slice(0, 3).map((suggestion) => (
                    <Card key={suggestion.id} className={cn(
                        "p-4 relative overflow-hidden transition-all hover:shadow-md border-l-4",
                        suggestion.priority === 'high' ? "border-l-stock-low bg-stock-low/5" :
                            suggestion.priority === 'medium' ? "border-l-primary bg-primary/5" :
                                "border-l-muted-foreground bg-secondary/30"
                    )}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-3">
                                <div className={cn(
                                    "p-2 rounded-full shrink-0",
                                    suggestion.priority === 'high' ? "bg-stock-low/20 text-stock-low" :
                                        suggestion.priority === 'medium' ? "bg-primary/20 text-primary" :
                                            "bg-muted text-muted-foreground"
                                )}>
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-sm leading-none">{suggestion.message}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        {suggestion.type === 'usage_prediction' && "Based on your usage habits"}
                                        {suggestion.type === 'low_stock' && "Stock below minimum"}
                                        {suggestion.type === 'expiring' && "Approaching expiry date"}
                                        {suggestion.type === 'substitution' && "Alternative available"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-xs font-medium hover:bg-background/80"
                                    onClick={() => handleAction(suggestion)}
                                >
                                    {suggestion.actionLabel || 'View'}
                                </Button>
                                <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleDismiss(suggestion.id)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
