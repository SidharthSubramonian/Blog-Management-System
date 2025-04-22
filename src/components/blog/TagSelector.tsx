
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  popularTags?: string[];
}

export function TagSelector({ 
  selectedTags, 
  setSelectedTags, 
  popularTags = ["Technology", "Programming", "Design", "Health", "Travel", "Food"] 
}: TagSelectorProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    
    if (!normalizedTag) return;
    
    if (normalizedTag.length < 2) {
      toast.error("Tag must be at least 2 characters long");
      return;
    }
    
    if (normalizedTag.length > 20) {
      toast.error("Tag must be less than 20 characters long");
      return;
    }
    
    if (selectedTags.map(t => t.toLowerCase()).includes(normalizedTag)) {
      toast.error("Tag already added");
      return;
    }
    
    if (selectedTags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }
    
    // Capitalize first letter
    const formattedTag = normalizedTag.charAt(0).toUpperCase() + normalizedTag.slice(1);
    setSelectedTags([...selectedTags, formattedTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-background/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag} tag</span>
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder="Add tag..."
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => addTag(tagInput)}
          disabled={!tagInput.trim()}
        >
          Add
        </Button>
      </div>
      
      {popularTags && popularTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Popular Tags</h4>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Button
                key={tag}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 rounded-full"
                onClick={() => addTag(tag)}
                disabled={selectedTags.map(t => t.toLowerCase()).includes(tag.toLowerCase())}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
