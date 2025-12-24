import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import ShoppingList from "./pages/ShoppingList";
import Analytics from "./pages/Analytics";
import Wishlist from "./pages/Wishlist";
import TravelMode from "./pages/TravelMode";
import ExpiryTracker from "./pages/ExpiryTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/travel" element={<TravelMode />} />
          <Route path="/expiry" element={<ExpiryTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
