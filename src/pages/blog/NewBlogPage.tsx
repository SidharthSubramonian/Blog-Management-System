
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/blog/TagSelector";
import { ImageUploader } from "@/components/blog/ImageUploader";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { createBlog } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function NewBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Create a mutation for the blog creation
  const createBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      toast.success("Blog published successfully!");
      navigate("/dashboard/blogs");
    },
    onError: (error: Error) => {
      toast.error(`Failed to publish blog: ${error.message}`);
      setIsPublishing(false);
    }
  });

  const handleSaveDraft = () => {
    if (!title) {
      toast.error("Please enter a title for your blog post");
      return;
    }
    
    setIsSaving(true);
    
    // Simulate saving a draft
    // In a real app, you would call an API to save draft
    setTimeout(() => {
      toast.success("Draft saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please enter a title for your blog post");
      return;
    }
    
    if (!content) {
      toast.error("Please enter content for your blog post");
      return;
    }
    
    if (!excerpt) {
      toast.error("Please enter an excerpt for your blog post");
      return;
    }
    
    if (selectedTags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }
    
    setIsPublishing(true);
    
    try {
      await createBlogMutation.mutateAsync({
        title,
        content,
        excerpt,
        cover_image: coverImage,
        tags: selectedTags
      });
    } catch (error) {
      // Error is handled by the mutation
      console.error("Error publishing blog:", error);
    }
  };

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/blogs" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button 
            type="submit"
            onClick={handlePublish}
            disabled={isPublishing || isSaving || createBlogMutation.isPending}
          >
            {createBlogMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>
      
      <form className="space-y-8" onSubmit={handlePublish}>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter a captivating title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (Short summary)</Label>
          <Textarea
            id="excerpt"
            placeholder="Write a brief summary of your post (displayed in previews)..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cover-image">Cover Image</Label>
          <ImageUploader 
            imageUrl={coverImage}
            setImageUrl={setCoverImage}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Write your blog post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className="font-medium"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            popularTags={[]}
          />
        </div>
      </form>
    </div>
  );
}
