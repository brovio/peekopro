import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Flooko from "./pages/Flooko";
import Breakdown from "./pages/Breakdown";
import Notes from "./pages/Notes";
import Options from "./pages/Options";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider 
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      themes={["light", "dark", "zanely-1", "zanely-2", "flookey-1", "flookey-2", "flookey-3"]}
    >
      <AuthProvider>
        <NotificationProvider>
          <SettingsProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Flooko />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/breakdown"
                element={
                  <ProtectedRoute>
                    <Breakdown />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <Notes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/options"
                element={
                  <ProtectedRoute>
                    <Options />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </SettingsProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;