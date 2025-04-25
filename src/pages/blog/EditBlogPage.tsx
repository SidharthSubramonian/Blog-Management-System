
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/blog/TagSelector";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTags } from "@/lib/api";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the blog details
  const { data: blog } = useQuery({
    queryKey: ["blog-edit", id],
    queryFn: async () => {
      if (!id) throw new Error("Blog ID is required");
      
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  // Fetch available tags
  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags
  });

  // Populate form with blog data when available
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "");
      setContent(blog.content || "");
      setExcerpt(blog.excerpt || "");
      setCoverImage(blog.cover_image || "");
      setSelectedTags(blog.tags || []);
      setIsLoading(false);
    }
  }, [blog]);

  // Update blog mutation
  const updateBlogMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user) throw new Error("Blog ID and user are required");
      
      const { error } = await supabase
        .from("blogs")
        .update({
          title,
          content,
          excerpt,
          cover_image: coverImage,
          tags: selectedTags,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .eq("author_id", user.id);
        
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog-edit", id] });
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
      queryClient.invalidateQueries({ queryKey: ["my-blogs"] });
      navigate("/dashboard/blogs");
    },
    onError: () => {
      toast.error("Failed to update blog");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBlogMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
      <h1 className="font-heading text-3xl font-bold mb-6">Edit Blog Post</h1>
      
      {isLoading ? (
        <div className="flex justify-center my-12">Loading blog details...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium">Excerpt</label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description of your blog"
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">Content</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your blog content"
              rows={12}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="coverImage" className="text-sm font-medium">Cover Image URL</label>
            <Input
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <TagSelector
              availableTags={tags.map(tag => tag.name)}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={updateBlogMutation.isPending}
            >
              {updateBlogMutation.isPending ? "Updating..." : "Update Blog"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/dashboard/blogs")}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
