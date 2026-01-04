/**
 * Error Boundary Component
 * Catches React errors and shows a friendly error message
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 mb-4">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-6">
                            We encountered an unexpected error. Please try again or reload the page.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={this.handleRetry}>
                                Try Again
                            </Button>
                            <Button onClick={this.handleReload}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reload Page
                            </Button>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left p-4 bg-muted rounded-lg">
                                <summary className="cursor-pointer text-sm font-medium">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="mt-2 text-xs overflow-auto text-destructive">
                                    {this.state.error.message}
                                    {'\n'}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
