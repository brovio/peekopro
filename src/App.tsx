import { useState, useEffect } from "react"
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { supabase } from "./integrations/supabase/client"
import { AuthProvider } from "./contexts/AuthContext"
import { SettingsProvider } from "./contexts/SettingsContext"
import { NotificationProvider } from "./contexts/NotificationContext"

import Login from "./pages/Login"
import ImageCreator from "./pages/ImageCreator"
import Gallery from "./pages/Gallery"
import Journal from "./pages/Journal"
import Notes from "./pages/Notes"
import Options from "./pages/Options"
import Flooko from "./pages/Flooko"
import Breakdown from "./pages/Breakdown"
import ProtectedRoute from "./components/auth/ProtectedRoute"

const queryClient = new QueryClient()

// App layout component with providers
const AppLayout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <SettingsProvider>
          <NotificationProvider>
            <Outlet />
            <Toaster />
          </NotificationProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsInitialized(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        queryClient.clear()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Navigate to="/images" replace />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/images",
          element: (
            <ProtectedRoute>
              <ImageCreator />
            </ProtectedRoute>
          ),
        },
        {
          path: "/gallery",
          element: (
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          ),
        },
        {
          path: "/journal",
          element: (
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notes",
          element: (
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/options",
          element: (
            <ProtectedRoute>
              <Options />
            </ProtectedRoute>
          ),
        },
        {
          path: "/flooko",
          element: (
            <ProtectedRoute>
              <Flooko />
            </ProtectedRoute>
          ),
        },
        {
          path: "/breakdown",
          element: (
            <ProtectedRoute>
              <Breakdown />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ])

  if (!isInitialized) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App