import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import EventDone from "./pages/EventDone.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminSetup from "./pages/admin/AdminSetup.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminEventForm from "./pages/admin/AdminEventForm.tsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.tsx";

import { EventsProvider } from "./contexts/EventsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EventsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/event/:id/done" element={<EventDone />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/event/new"
              element={
                <ProtectedAdminRoute>
                  <AdminEventForm />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/event/:id/edit"
              element={
                <ProtectedAdminRoute>
                  <AdminEventForm />
                </ProtectedAdminRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
