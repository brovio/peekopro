import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Toaster } from "@/components/ui/toaster";
import Tasks from "./pages/Tasks";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SettingsProvider>
        <BrowserRouter>
          <Tasks />
          <Toaster />
        </BrowserRouter>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;