import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const usePromptHistory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promptHistory = [], isLoading } = useQuery({
    queryKey: ['prompt-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompt_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching prompt history",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const { mutate: addPrompt } = useMutation({
    mutationFn: async (prompt: string) => {
      const { error } = await supabase
        .from('prompt_history')
        .insert([{ prompt }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompt-history'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving prompt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    promptHistory,
    isLoading,
    addPrompt,
  };
};