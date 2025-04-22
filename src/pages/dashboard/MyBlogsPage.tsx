
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockBlogs } from "@/lib/mock-data";
import { Blog } from "@/lib/types";
import { 
  Edit, 
  Eye, 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function MyBlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs);
  
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success("Blog deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl font-bold">My Blogs</h1>
        <Button asChild>
          <Link to="/new-blog">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-center">Views</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">
                    <Link to={`/blogs/${blog.id}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {blog.publishedAt ? (
                      <Badge className="flex w-fit items-center gap-1 bg-green-500">
                        <CheckCircle className="h-3 w-3" />
                        Published
                      </Badge>
                    ) : blog.isPending ? (
                      <Badge variant="outline" className="flex w-fit items-center gap-1 text-amber-500 border-amber-500">
                        <Clock className="h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="w-fit">
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      {blog.viewCount}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                      {blog.commentCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(blog.createdAt, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/blogs/edit/${blog.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No blogs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
