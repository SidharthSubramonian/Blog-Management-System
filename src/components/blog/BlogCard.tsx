
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageSquare } from "lucide-react";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    excerpt: string;
    cover_image?: string;
    created_at: string;
    author: {
      username: string;
      avatar_url?: string;
    };
    tags: string[];
    comments: { count: number }[];
    view_count: number;
  };
}

export function BlogCard({ blog }: BlogCardProps) {
  const commentCount = blog.comments?.[0]?.count || 0;
  
  return (
    <article className="blog-card group">
      <Link to={`/blogs/${blog.id}`} className="block">
        {blog.cover_image && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={blog.author.avatar_url} alt={blog.author.username} />
              <AvatarFallback>{blog.author.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span>{blog.author.username}</span>
            <span>•</span>
            <time dateTime={blog.created_at}>
              {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
            </time>
          </div>
          <h3 className="mt-3 text-xl font-semibold leading-tight tracking-tight md:text-2xl">
            {blog.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-muted-foreground">
            {blog.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-accent">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{blog.view_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
