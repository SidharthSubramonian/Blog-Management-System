
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function CommentsPage() {
  const [deletedComments, setDeletedComments] = useState<string[]>([]);
  
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['dashboard-comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          blog:blogs(id, title),
          author:profiles(id, username, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
  
  const handleDeleteComment = async (id: string) => {
    // Local delete for UI responsiveness
    setDeletedComments(prev => [...prev, id]);
    toast.success("Comment deleted");
  };
  
  const filteredComments = comments.filter(comment => !deletedComments.includes(comment.id));

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Comments</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Blog</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading comments...
                </TableCell>
              </TableRow>
            ) : filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="max-w-[300px] truncate">
                    {comment.content}
                  </TableCell>
                  <TableCell>
                    <a href={`/blogs/${comment.blog?.id}`} className="hover:underline">
                      {comment.blog?.title || "Unknown Blog"}
                    </a>
                  </TableCell>
                  <TableCell>
                    {comment.author?.username || "Unknown User"}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteComment(comment.id)}
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
                <TableCell colSpan={5} className="h-24 text-center">
                  No comments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
