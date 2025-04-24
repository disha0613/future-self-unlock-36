
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

// Pages
import MirrorRoom from "@/components/MirrorRoom";
import NonNegotiables from "@/components/NonNegotiables";
import ShadowJournal from "@/components/ShadowJournal";
import Dashboard from "@/components/Dashboard";
import NotFound from "@/pages/NotFound";
import VoiceNotes from "@/components/VoiceNotes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MirrorRoom />} />
            <Route path="/tasks" element={<NonNegotiables />} />
            <Route path="/journal" element={<ShadowJournal />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/voice" element={<VoiceNotes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
