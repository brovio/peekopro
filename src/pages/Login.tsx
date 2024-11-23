import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: email.trim() }]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "We'll notify you when registration opens.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message === "duplicate key value violates unique constraint \"waitlist_email_key\""
          ? "This email is already on the waitlist."
          : "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <Card className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm border-border/50">
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/ca194906-3c7b-4034-87d0-54be86279b74.png"
              alt="Peekopro Logo"
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
          view="sign_in"
          showLinks={false}
        />

        <div className="mt-8 pt-8 border-t border-border/50">
          <h3 className="text-lg font-semibold text-center mb-4">Join the Waitlist</h3>
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1A1F2C] border-[#2A2F3C] text-white"
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;