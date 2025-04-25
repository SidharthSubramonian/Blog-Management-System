
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CommentsPage() {
  const queryClient = useQueryClient();
  
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
  
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      return commentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-comments'] });
      toast.success("Comment deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete comment");
    }
  });

  const handleDeleteComment = (id: string) => {
    deleteCommentMutation.mutate(id);
  };

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
            ) : comments.length > 0 ? (
              comments.map((comment) => (
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
                        disabled={deleteCommentMutation.isPending}
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
