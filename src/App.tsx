import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import ApiKeyManager from "./components/ui/ApiKeyManager";

const queryClient = new QueryClient();

const App = () => {
  const [showApiManager, setShowApiManager] = useState(false);
  const [keySequence, setKeySequence] = useState("");

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const newSequence = keySequence + e.key;
      setKeySequence(newSequence);

      if (newSequence.includes("peekopro17")) {
        setShowApiManager(true);
        setKeySequence("");
      }

      // Reset sequence after 2 seconds of no input
      setTimeout(() => setKeySequence(""), 2000);
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [keySequence]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ApiKeyManager open={showApiManager} onOpenChange={setShowApiManager} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;