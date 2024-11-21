import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadInputProps {
  onFileUpload: (url: string) => void;
}

export function FileUploadInput({ onFileUpload }: FileUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Handle file upload logic here
      // For now, we'll just simulate an upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFileUpload("uploaded-file-url");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Input
      type="file"
      accept="*/*"
      onChange={handleFileChange}
      disabled={isUploading}
      className="w-full"
    />
  );
}
