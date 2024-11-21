import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm border-border/50">
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/3fcd2b3e-6c2e-4e5e-a2ce-3c8528cf39b3.png"
              alt="Brov.io Logo"
              className="w-[300px] object-contain"
            />
          </div>
          <p className="text-muted-foreground/80">Sign in to manage your tasks</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#1A1F2C',
                  defaultButtonBackgroundHover: '#2A2F3C',
                  inputBackground: '#1A1F2C',
                  inputBorder: '#2A2F3C',
                  inputBorderHover: '#3A3F4C',
                  inputBorderFocus: '#9b87f5',
                  inputText: 'white',
                  inputLabelText: '#9F9EA1',
                  inputPlaceholder: '#8A898C',
                }
              }
            },
            className: {
              container: 'text-foreground',
              label: 'text-muted-foreground',
              button: 'text-white',
              anchor: 'text-primary hover:text-primary/80',
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;