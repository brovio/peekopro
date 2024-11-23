import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AdminPro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Profile query error:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
    retry: false
  });

  useEffect(() => {
    if (profile && !profile.is_admin) {
      navigate('/');
    }
  }, [profile, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-navy-900">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 bg-[#1A1F2C]">
          <h1 className="text-2xl font-bold mb-6 text-gray-100">Admin Pro Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-4 bg-[#2A2F3C] border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">User Management</h2>
              <p className="text-gray-300">Manage user accounts and permissions</p>
            </Card>
            
            <Card className="p-4 bg-[#2A2F3C] border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">System Analytics</h2>
              <p className="text-gray-300">View system performance and usage statistics</p>
            </Card>
            
            <Card className="p-4 bg-[#2A2F3C] border-gray-700">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">Configuration</h2>
              <p className="text-gray-300">Manage system settings and configurations</p>
            </Card>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPro;