
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
  return data;
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
      slug, // Add the required slug field
      published_at: new Date().toISOString()
    });

  if (error) throw error;
  return data;
}

export async function incrementBlogView(blogId: string) {
  // Fix the type error by using the correct parameter type
  const { error } = await supabase.rpc('increment_blog_view', { 
    blog_id: blogId 
  });
  if (error) throw error;
}
