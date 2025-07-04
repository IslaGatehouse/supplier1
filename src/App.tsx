import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SupplierRegistration from "./pages/SupplierRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ConfirmationPage from "./pages/ConfirmationPage";
import NotFound from "./pages/NotFound";
import StartRegistrationChoice from "./pages/StartRegistrationChoice";
import SupplierInviteCode from "./pages/SupplierInviteCode";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import SupplierLogin from "./pages/SupplierLogin";
import SupplierProfile from "./pages/SupplierProfile";
import ConfirmationPageInvite from "./pages/ConfirmationPageInvite";
import SupplierRegistrationInvite from "./pages/SupplierRegistrationInvite";
import SupplierCreateLogin from "./pages/SupplierCreateLogin";
import CompanyDashboard from "./pages/CompanyDashboard";

const queryClient = new QueryClient();

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Button
          size="icon"
          className={`fixed top-4 right-4 z-50 transition-colors ${darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
          aria-label="Toggle dark mode"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/start-registration" element={<StartRegistrationChoice />} />
            <Route path="/supplier-registration-request" element={<SupplierInviteCode />} />
            <Route path="/supplier-registration-join" element={<SupplierRegistration />} />
            <Route path="/supplier-registration" element={<SupplierRegistration />} />
            <Route path="/supplier-login" element={<SupplierLogin />} />
            <Route path="/supplier-profile" element={<SupplierProfile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/confirmation-invite" element={<ConfirmationPageInvite />} />
            <Route path="/supplier-registration-invite" element={<SupplierRegistrationInvite />} />
            <Route path="/supplier-create-login" element={<SupplierCreateLogin />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
