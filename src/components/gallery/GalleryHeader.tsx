import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface GalleryHeaderProps {
  selectedCount: number;
  onDeleteSelected: () => void;
}

export function GalleryHeader({ selectedCount, onDeleteSelected }: GalleryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Image Gallery</h1>
      {selectedCount > 0 && (
        <Button
          variant="destructive"
          onClick={onDeleteSelected}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Selected ({selectedCount})
        </Button>
      )}
    </div>
  );
}