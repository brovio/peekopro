import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";

interface NoteActionsProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewNote: () => void;
}

const NoteActions = ({ onExport, onImport, onNewNote }: NoteActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 sm:h-10 sm:w-auto sm:px-4"
        onClick={onExport}
      >
        <Download className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 sm:h-10 sm:w-auto sm:px-4" 
        asChild
      >
        <label>
          <Upload className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Import</span>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onImport}
          />
        </label>
      </Button>
      <Button 
        size="sm" 
        className="h-8 w-8 p-0 sm:h-10 sm:w-auto sm:px-4"
        onClick={onNewNote}
      >
        <Plus className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">New Note</span>
      </Button>
    </div>
  );
};

export default NoteActions;