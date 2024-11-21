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
import Journal from "./pages/Journal";
import ImageCreator from "./pages/ImageCreator";
import Gallery from "./pages/Gallery";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
                path="/journal"
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/images"
                element={
                  <ProtectedRoute>
                    <ImageCreator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gallery"
                element={
                  <ProtectedRoute>
                    <Gallery />
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