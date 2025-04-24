
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs, fetchBlogViewStats, fetchMyBlogs } from "@/lib/api";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart2, FileText, MessageSquare, Eye, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Fetch user's blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['dashboard-blogs'],
    queryFn: () => fetchMyBlogs(),
    enabled: !!user
  });
  
  // Fetch view statistics
  const { data: viewsData = [] } = useQuery({
    queryKey: ['blog-view-stats'],
    queryFn: () => fetchBlogViewStats(7),
    enabled: !!user
  });

  // Aggregate stats from blogs
  const stats = React.useMemo(() => {
    const publishedBlogs = blogs.filter(blog => blog.published_at).length;
    const draftBlogs = blogs.filter(blog => !blog.published_at && !blog.is_pending).length;
    const pendingBlogs = blogs.filter(blog => blog.is_pending).length;
    const totalViews = blogs.reduce((sum, b) => sum + (b.view_count || 0), 0);
    const totalComments = blogs.reduce((sum, b) => sum + ((b.comments && b.comments[0]?.count) || 0), 0);
    return {
      totalBlogs: blogs.length,
      totalViews,
      totalComments,
      publishedBlogs,
      draftBlogs,
      pendingBlogs,
    };
  }, [blogs]);

  const recentBlogs = blogs.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/new-blog">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedBlogs} published, {stats.draftBlogs} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              +{viewsData.length > 0 ? viewsData[viewsData.length - 1].views : 0} views recently
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.publishedBlogs} published blogs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews > 0
                ? Math.round((stats.totalComments / stats.totalViews) * 100 * 10) / 10
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Comments per 100 views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Views Overview</CardTitle>
          <CardDescription>Your blog views for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blogs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blogs</CardTitle>
          <CardDescription>Your latest blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-2 animate-pulse">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="font-medium hover:underline"
                    >
                      {blog.title}
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags && blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags && blog.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{blog.view_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{blog.comments?.[0]?.count ?? 0}</span>
                      </div>
                      <span>
                        {formatDistanceToNow(
                          blog.published_at
                            ? new Date(blog.published_at)
                            : new Date(blog.created_at),
                          { addSuffix: true }
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/dashboard/blogs/edit/${blog.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div>No recent blogs found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
