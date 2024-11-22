import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { AuthProvider } from "./contexts/AuthContext"
import { supabase } from "./integrations/supabase/client"
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  </BrowserRouter>
);