/**
 * Stockee - Smart Inventory Tracker
 * Main Application Component
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/common";

// Pages
import Index from "@/pages/Index";
import Inventory from "@/pages/Inventory";
import ShoppingList from "@/pages/ShoppingList";
import Analytics from "@/pages/Analytics";
import Wishlist from "@/pages/Wishlist";
import TravelMode from "@/pages/TravelMode";
import ExpiryTracker from "@/pages/ExpiryTracker";
import NotFound from "@/pages/NotFound";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Main routes */}
                <Route path="/" element={<Index />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/shopping" element={<ShoppingList />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/travel" element={<TravelMode />} />
                <Route path="/expiry" element={<ExpiryTracker />} />

                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
