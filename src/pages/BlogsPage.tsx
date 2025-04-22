
import { useState } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { mockBlogs, mockTags } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Filter blogs based on search query and selected tags
  const filteredBlogs = mockBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => blog.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="container max-w-6xl py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="font-heading text-4xl font-bold">Explore Blogs</h1>
        <p className="text-xl text-muted-foreground">
          Discover articles on a wide range of topics
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium">Popular Tags:</span>
          {mockTags.slice(0, 6).map(tag => (
            <Badge 
              key={tag.id}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
          
          {(searchQuery || selectedTags.length > 0) && (
            <Button variant="ghost" size="sm" className="ml-2" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Blogs Grid */}
      {filteredBlogs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="bg-muted/50 rounded-xl p-10 text-center">
          <h3 className="font-medium text-xl mb-2">No blogs found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any blogs matching your criteria.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
}
