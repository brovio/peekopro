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
import NoteCard from "@/components/notes/NoteCard";
import NoteActions from "@/components/notes/NoteActions";

interface Note {
  id: string;
  title: string;
  description: string;
  color: string;
  text_color: string;
}

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [showApiManager, setShowApiManager] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createNote = useMutation({
    mutationFn: async (newNote: { title: string; description: string; color: string; text_color: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...newNote, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setOpen(false);
      setTitle("");
      setDescription("");
      setColor("#ffffff");
      toast({
        title: "Note created",
        description: "Your note has been saved successfully",
      });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });
    },
  });

  const exportNotes = () => {
    const csv = [
      ['Title', 'Description', 'Color', 'Text Color'],
      ...notes.map(note => [
        note.title,
        note.description,
        note.color,
        note.text_color
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => 
        row.split(',').map(cell => cell.replace(/^"(.*)"$/, '$1'))
      );
      
      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const [title, description, color, text_color] = rows[i];
        if (!title) continue;
        
        await createNote.mutateAsync({
          title,
          description,
          color,
          text_color
        });
      }
    };
    reader.readAsText(file);
  };

  const calculateTextColor = (bgColor: string) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const handleEdit = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
      setColor(note.color);
      setOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onShowApiManager={() => setShowApiManager(true)} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Notes</h1>
          <NoteActions
            onExport={exportNotes}
            onImport={importNotes}
            onNewNote={() => setOpen(true)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              onDelete={() => deleteNote.mutate(note.id)}
              onEdit={handleEdit}
            />
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <label>Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <Button
                onClick={() => {
                  const text_color = calculateTextColor(color);
                  createNote.mutate({ title, description, color, text_color });
                }}
              >
                Create Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Notes;
