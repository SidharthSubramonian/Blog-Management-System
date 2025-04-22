
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "@/components/blog/CommentSection";
import { getBlogById, getCommentsForBlog } from "@/lib/mock-data";
import { Blog } from "@/lib/types";
import { Calendar, Edit, Eye, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      if (id) {
        const foundBlog = getBlogById(id);
        if (foundBlog) {
          setBlog(foundBlog);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

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

  if (loading) {
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

  if (!blog) {
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

  const comments = getCommentsForBlog(blog.id);

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      {/* Blog Header */}
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={blog.author.image} alt={blog.author.name} />
              <AvatarFallback>{blog.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{blog.author.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}>
              {blog.publishedAt 
                ? format(blog.publishedAt, 'MMMM d, yyyy') 
                : format(blog.createdAt, 'MMMM d, yyyy')}
            </time>
          </div>
          
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{blog.viewCount} views</span>
          </div>
        </div>
      </div>
      
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="rounded-xl overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-auto object-cover max-h-[400px]"
          />
        </div>
      )}
      
      {/* Blog Controls */}
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {blog.tags.map(tag => (
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
          
          {/* These buttons should only be visible to the author */}
          {blog.authorId === "1" && (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/dashboard/blogs/edit/${blog.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Blog Content */}
      <div 
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
      />
      
      <Separator />
      
      {/* Comments Section */}
      <CommentSection blogId={blog.id} comments={comments} />
    </div>
  );
}
