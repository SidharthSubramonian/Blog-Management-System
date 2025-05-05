
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Link, Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/uploadUtils";
import { toast } from "sonner";

interface ImageUploaderProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export function ImageUploader({ imageUrl, setImageUrl }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInputMode, setUrlInputMode] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImageUrl("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          {urlInputMode ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="pl-8"
                />
                <Link className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setUrlInputMode(false)}>
                <Upload className="h-4 w-4 mr-1" />
                Switch to Upload
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="relative w-full cursor-pointer" 
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setUrlInputMode(true)}>
                <Link className="h-4 w-4 mr-1" />
                Enter URL
              </Button>
            </div>
          )}
        </div>
        {imageUrl && (
          <Button variant="outline" size="icon" onClick={clearImage}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {imageUrl && (
        <div className="mt-2 rounded-md overflow-hidden h-[200px]">
          <img
            src={imageUrl}
            alt="Cover preview"
            className="h-full w-full object-cover"
            onError={() => {
              toast.error("Invalid image URL");
              setImageUrl("");
            }}
          />
        </div>
      )}
    </div>
  );
}
