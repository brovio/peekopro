import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { BookOpen, Plus } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  gratitude: string[];
  goals: string[];
  reflections: string[];
  created_at: string;
}

const Journal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(5);
  const [gratitude, setGratitude] = useState("");
  const [goals, setGoals] = useState("");
  const [reflections, setReflections] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: journalEntries = [], isLoading } = useQuery({
    queryKey: ['journal_entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createJournalEntry = useMutation({
    mutationFn: async (newEntry: Omit<JournalEntry, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{ ...newEntry, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal_entries'] });
      setOpen(false);
      resetForm();
      toast({
        title: "Journal Entry Created",
        description: "Your journal entry has been saved successfully",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood(5);
    setGratitude("");
    setGoals("");
    setReflections("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6" /> Journal
          </h1>
          <Button onClick={() => setOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> New Entry
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Loading journal entries...</div>
        ) : journalEntries.length === 0 ? (
          <div className="text-center text-gray-500">No journal entries yet. Start journaling!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journalEntries.map((entry) => (
              <Card key={entry.id} className="bg-secondary/50">
                <CardHeader>
                  <CardTitle>{entry.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                  <p className="mb-2">{entry.content.slice(0, 100)}...</p>
                  <div className="flex items-center">
                    <span className="mr-2">Mood:</span>
                    <div className="w-full">
                      <Slider 
                        value={[entry.mood]} 
                        max={10} 
                        step={1} 
                        disabled 
                        className="cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your journal entry here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div>
                <label className="block mb-2">Mood (1-10)</label>
                <Slider 
                  value={[mood]} 
                  onValueChange={(value) => setMood(value[0])} 
                  max={10} 
                  step={1} 
                />
              </div>
              <Input
                placeholder="What are you grateful for today?"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
              />
              <Input
                placeholder="What are your goals for today?"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
              <Input
                placeholder="Reflections on the day"
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
              />
              <Button 
                onClick={() => createJournalEntry.mutate({
                  title,
                  content,
                  mood,
                  gratitude: gratitude ? [gratitude] : [],
                  goals: goals ? [goals] : [],
                  reflections: reflections ? [reflections] : [],
                })}
                disabled={!title || !content}
              >
                Create Journal Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Journal;