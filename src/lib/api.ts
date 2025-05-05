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
  
  return data || [];
}

export async function fetchBlogById(id: string) {
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
  
  return data;
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
  
  return data || [];
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
  try {
    const { data: blogData, error } = await supabase
      .from('blogs')
      .select('view_count')
      .eq('id', blogId)
      .single();
    
    if (error) {
      console.error("Failed to get blog view count:", error);
      return;
    }
    
    const viewCount = (blogData?.view_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('blogs')
      .update({ view_count: viewCount })
      .eq('id', blogId);
      
    if (updateError) {
      console.error("Failed to update view count:", updateError);
    }
  } catch (e) {
    console.error("Error in incrementBlogView:", e);
  }
}

export async function fetchBlogViewStats(days = 7) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("User must be logged in to fetch view stats");
  
  const { data: blogs, error: blogError } = await supabase
    .from('blogs')
    .select('id, view_count, created_at')
    .eq('author_id', user.id);
    
  if (blogError) throw blogError;
  
  const today = new Date();
  const stats = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const viewsOnDay = blogs.reduce((sum, blog) => {
      const blogDate = new Date(blog.created_at);
      if (blogDate <= date) {
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

export async function updateProfile(profileData: {
  username?: string;
  bio?: string;
  avatar_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to update profile');

  const { error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', user.id);

  if (error) throw error;
}

export async function fetchUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to fetch profile');

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteComment(commentId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to delete comment');

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}

export async function deleteBlog(blogId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User must be logged in to delete blog');

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', blogId)
    .eq('author_id', user.id);

  if (error) throw error;
}
