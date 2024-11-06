import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome to Brov.io</h1>
          <p className="text-muted-foreground mt-2">Sign in to manage your tasks</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;