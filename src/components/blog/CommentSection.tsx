
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

interface CommentSectionProps {
  blogId: string;
  comments: Comment[];
}

export function CommentSection({ blogId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user, replace with actual auth
  const currentUser = {
    id: "1",
    name: "John Doe",
    image: "",
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content: commentText,
        createdAt: new Date(),
        author: currentUser,
      };
      
      setComments([newComment, ...comments]);
      setCommentText("");
      setIsSubmitting(false);
      toast.success("Comment posted successfully!");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 font-heading text-2xl font-semibold">
        <MessageSquare className="h-6 w-6" />
        Comments ({comments.length})
      </h3>
      
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
      
      {comments.length > 0 ? (
        <div className="space-y-6 divide-y">
          {comments.map((comment) => (
            <div key={comment.id} className="pt-6 first:pt-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.image} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-md bg-muted/50 p-6 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-medium">No comments yet</h3>
          <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
