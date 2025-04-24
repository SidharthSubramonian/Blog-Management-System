
import { supabase } from "@/integrations/supabase/client";

export async function fetchBlogs({ featured = false, limit = 10 } = {}) {
  const query = supabase
    .from('blogs')
    .select(`
      *,
      author:profiles(id, username, avatar_url),
      comments(count)
    `)
    .eq('is_pending', false)
    .not('published_at', 'is', null);

  if (featured) {
    query.eq('featured', true);
  }

  const { data, error } = await query.limit(limit);
  
  if (error) throw error;
  
  // Ensure blog entries have author data, even if null
  const processedData = data?.map(blog => ({
    ...blog,
    author: blog.author?.[0] || null // Get first item from profiles array or null if empty
  }));
  
  return processedData || [];
}

export async function fetchBlogById(id: string) {
  // Get the blog post
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:profiles(id, username, avatar_url),
      comments(
        id,
        content,
        created_at,
        author:profiles(id, username, avatar_url)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Process data to ensure author is properly formatted
  const processedData = {
    ...data,
    author: data.author?.[0] || null,
    comments: data.comments?.map(comment => ({
      ...comment,
      author: comment.author?.[0] || null
    })) || []
  };
  
  // Increment view count
  await incrementBlogView(id);
  
  return processedData;
}

export async function fetchMyBlogs() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to fetch their blogs");
  
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      *,
      author:profiles(id, username, avatar_url),
      comments(count)
    `)
    .eq('author_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Process data to ensure author is properly formatted
  const processedData = data?.map(blog => ({
    ...blog,
    author: blog.author?.[0] || null
  }));
  
  return processedData || [];
}

export async function fetchTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*');

  if (error) throw error;
  return data;
}

export async function createComment(blogId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to comment');

  const { error } = await supabase
    .from('comments')
    .insert({
      blog_id: blogId,
      content,
      author_id: user.id
    });

  if (error) throw error;
}

export async function createBlog(blogData: {
  title: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  tags: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to create a blog');

  // Generate a slug from the title
  const slug = blogData.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');

  const { data, error } = await supabase
    .from('blogs')
    .insert({
      ...blogData,
      author_id: user.id,
      is_pending: false,
      slug,
      published_at: new Date().toISOString()
    });

  if (error) throw error;
  return data;
}

export async function incrementBlogView(blogId: string) {
  // Fix the type error by explicitly specifying the parameter type
  const { error } = await supabase.rpc('increment_blog_view', { 
    blog_id: blogId 
  } as { blog_id: string });
  
  if (error) {
    console.error("Failed to increment view count:", error);
  }
}

export async function fetchBlogViewStats(days = 7) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to fetch view stats");
  
  // Get user's blogs
  const { data: blogs, error: blogError } = await supabase
    .from('blogs')
    .select('id, view_count, created_at')
    .eq('author_id', user.id);
    
  if (blogError) throw blogError;
  
  // Generate daily view stats based on blog creation and view counts
  const today = new Date();
  const stats = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Calculate views for blogs that existed on this date
    const viewsOnDay = blogs.reduce((sum, blog) => {
      const blogDate = new Date(blog.created_at);
      if (blogDate <= date) {
        // Distribute views across days since creation
        const daysSinceCreation = Math.max(1, Math.floor((today.getTime() - blogDate.getTime()) / (1000 * 60 * 60 * 24)));
        return sum + (blog.view_count || 0) / daysSinceCreation;
      }
      return sum;
    }, 0);
    
    stats.push({
      day: dayStr,
      views: Math.round(viewsOnDay)
    });
  }
  
  return stats;
}
