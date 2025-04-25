
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Plus, Search, Trash2, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTagDialogOpen, setIsNewTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [localDeletedTags, setLocalDeletedTags] = useState<string[]>([]);
  const [expandedTags, setExpandedTags] = useState<string[]>([]);
  const { user } = useAuth();
  
  const { data: tags = [], refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
  });

  // Fetch blogs for expanded tags
  const { data: blogs = [], refetch: refetchBlogs } = useQuery({
    queryKey: ['blogs-by-tag', expandedTags],
    queryFn: async () => {
      if (!expandedTags.length) return [];
      
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, tags')
        .filter('tags', 'cs', `{${expandedTags.join(',')}}`)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: expandedTags.length > 0
  });

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error("Tag name is required");
      return;
    }
    
    try {
      const slug = newTagName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
        
      await supabase.from('tags').insert({
        name: newTagName,
        slug
      });
      
      toast.success("Tag created successfully");
      setNewTagName("");
      setIsNewTagDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create tag");
    }
  };
  
  const handleDeleteTag = (id: string) => {
    // This is just local UI state - in a real app would delete from DB
    setLocalDeletedTags(prev => [...prev, id]);
    toast.success("Tag deleted!");
  };

  const toggleTagExpansion = (tagName: string) => {
    setExpandedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };
  
  const filteredTags = tags
    .filter(tag => !localDeletedTags.includes(tag.id))
    .filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Tags</h1>
        <Dialog open={isNewTagDialogOpen} onOpenChange={setIsNewTagDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewTagDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTag}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <>
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-6 w-6"
                        onClick={() => toggleTagExpansion(tag.name)}
                      >
                        {expandedTags.includes(tag.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {tag.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {tag.slug}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(tag.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedTags.includes(tag.name) && (
                    <TableRow key={`${tag.id}-blogs`} className="bg-muted/30">
                      <TableCell colSpan={5} className="px-8 py-3">
                        <div className="text-sm font-medium mb-2">Posts with tag "{tag.name}":</div>
                        <div className="space-y-2 pl-2">
                          {blogs.filter(blog => blog.tags?.includes(tag.name)).length > 0 ? (
                            blogs
                              .filter(blog => blog.tags?.includes(tag.name))
                              .map(blog => (
                                <div key={blog.id} className="flex items-center gap-2">
                                  <Link 
                                    to={`/blogs/${blog.id}`} 
                                    className="text-sm text-primary hover:underline"
                                  >
                                    {blog.title}
                                  </Link>
                                </div>
                              ))
                          ) : (
                            <div className="text-sm text-muted-foreground italic">
                              No posts found with this tag
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tags found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
