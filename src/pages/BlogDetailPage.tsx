import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "@/components/blog/CommentSection";
import { Calendar, Edit, Eye, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBlogById, incrementBlogView } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => id ? fetchBlogById(id) : null,
    enabled: !!id
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully");
      navigate("/dashboard/blogs");
    },
    onError: (error) => {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  });

  useEffect(() => {
    if (id && !isLoading && blog) {
      incrementBlogView(id);
    }
  }, [id, isLoading, blog]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch(() => toast.error("Failed to share"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleDeleteBlog = () => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      if (id) {
        deleteBlogMutation.mutate(id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10 space-y-8 animate-pulse">
        <div className="h-8 w-3/4 bg-muted rounded"></div>
        <div className="h-4 w-1/2 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container max-w-4xl py-10 text-center">
        <h1 className="font-heading text-3xl font-bold mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-6">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/blogs">Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  // Handle author data with proper fallbacks
  const authorName = blog.author?.username || "Unknown Author";
  const authorInitials = authorName.substring(0, 2).toUpperCase();
  const avatarUrl = blog.author?.avatar_url || null;

  // Format comments for the CommentSection component
  const formattedComments = blog.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: new Date(comment.created_at),
    author: {
      id: comment.author?.id || "anonymous",
      name: comment.author?.username || "Anonymous", 
      image: comment.author?.avatar_url || null
    }
  }));

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl} alt={authorName} />
              <AvatarFallback>{authorInitials}</AvatarFallback>
            </Avatar>
            <span>{authorName}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.published_at || blog.created_at}>
              {blog.published_at 
                ? format(new Date(blog.published_at), 'MMMM d, yyyy')
                : format(new Date(blog.created_at), 'MMMM d, yyyy')}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{blog.view_count} views</span>
          </div>
        </div>
      </div>
      
      {blog.cover_image && (
        <div className="rounded-xl overflow-hidden">
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {blog.tags && blog.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-accent">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          
          {user?.id === blog.author_id && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/dashboard/blogs/edit/${blog.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteBlog}
                disabled={deleteBlogMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
      />
      
      <Separator />
      
      <CommentSection blogId={blog.id} comments={formattedComments} />
    </div>
  );
}
