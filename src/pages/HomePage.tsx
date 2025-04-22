
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/BlogCard";
import { mockBlogs } from "@/lib/mock-data";

export default function HomePage() {
  const featuredBlog = mockBlogs.find(blog => blog.featured);
  const recentBlogs = mockBlogs.slice(0, 3);

  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="container max-w-6xl space-y-6 py-12 text-center">
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to <span className="text-blog-primary">ScribeSphere</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Your go-to platform for discovering, creating, and sharing inspiring content.
          Join our community of writers and readers today.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/blogs">Explore Blogs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Featured Blog */}
      {featuredBlog && (
        <section className="container max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold">Featured Post</h2>
            <Button asChild variant="ghost">
              <Link to="/blogs">View All</Link>
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-heading text-2xl font-semibold leading-tight md:text-3xl">
                {featuredBlog.title}
              </h3>
              <p className="text-muted-foreground">
                {featuredBlog.excerpt}
              </p>
              <Button asChild>
                <Link to={`/blogs/${featuredBlog.id}`}>Read Article</Link>
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden h-[300px]">
              <img
                src={featuredBlog.coverImage}
                alt={featuredBlog.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Recent Blogs */}
      <section className="container max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-3xl font-bold">Recent Posts</h2>
          <Button asChild variant="ghost">
            <Link to="/blogs">View All</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blog-primary py-16 text-white">
        <div className="container max-w-6xl space-y-6 text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight md:text-4xl">
            Ready to start your blogging journey?
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-white/80">
            Join thousands of content creators who share their knowledge and stories every day.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
