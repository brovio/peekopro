import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Share2, Paperclip, Camera, Image } from "lucide-react";
import { FileUploadInput } from "@/components/ui/file-upload";
import { useState } from "react";

interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  text_color: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const NoteCard = ({ id, title, description, color, text_color, onDelete, onEdit }: NoteCardProps) => {
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: description,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ preferCurrentTab: true });
      // Handle the screenshot stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Error taking screenshot:", error);
    }
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle the camera stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  return (
    <Card
      className="p-4 relative animate-fade-in"
      style={{
        backgroundColor: color,
        color: text_color
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="whitespace-pre-wrap mb-4">{description}</p>
      <div className="flex gap-1 justify-end mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowFileUpload(true)}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleCamera}
        >
          <Camera className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleScreenshot}
        >
          <Image className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      {showFileUpload && (
        <div className="mt-4">
          <FileUploadInput onFileUpload={(url) => {
            // Handle file upload
            setShowFileUpload(false);
          }} />
        </div>
      )}
    </Card>
  );
};

export default NoteCard;