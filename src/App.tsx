import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SelectMode from "./pages/SelectMode";
import DementiaUser from "./pages/DementiaUser";
import Caregiver from "./pages/Caregiver";
import CaregiverRoutes from "./pages/CaregiverRoutes";
import ComfortMap from "./pages/ComfortMap";
import BuddyWatch from "./pages/BuddyWatch";
import ProfileSettings from "./pages/ProfileSettings";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/select-mode" element={<SelectMode />} />
          <Route path="/dementia-user" element={<DementiaUser />} />
          <Route path="/dementia-user/profile" element={<ProfileSettings />} />
          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/caregiver/routes" element={<CaregiverRoutes />} />
          <Route path="/caregiver/comfort-map" element={<ComfortMap />} />
          <Route path="/caregiver/buddy-watch" element={<BuddyWatch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
