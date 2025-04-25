
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogViewStats, fetchMyBlogs } from "@/lib/api";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Eye, MessageSquare, BarChart2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [days, setDays] = useState(7);
  
  const { data: blogs = [], isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['analytics-blogs'],
    queryFn: () => fetchMyBlogs()
  });
  
  const { data: viewStats = [], isLoading: isLoadingStats } = useQuery({
    queryKey: ['blog-view-stats', days],
    queryFn: () => fetchBlogViewStats(days)
  });

  // Calculate total stats
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.view_count || 0), 0);
  const totalComments = blogs.reduce((sum, blog) => sum + ((blog.comments && blog.comments[0]?.count) || 0), 0);
  
  // Create top posts data from real blogs
  const topPosts = [...blogs]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map(blog => ({
      title: blog.title,
      views: blog.view_count || 0,
      comments: blog.comments?.[0]?.count || 0
    }));

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (value === "weekly") {
      setDays(7);
    } else if (value === "monthly") {
      setDays(30);
    } else if (value === "yearly") {
      setDays(365);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <Select value={timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Last 7 days</SelectItem>
            <SelectItem value="monthly">Last 30 days</SelectItem>
            <SelectItem value="yearly">This year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {isLoadingStats ? "Loading..." : `+${viewStats.reduce((sum, day) => sum + day.views, 0)} in selected period`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              From {blogs.length} blog posts
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
              {totalViews > 0
                ? Math.round((totalComments / totalViews) * 100 * 10) / 10
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">
              Comments per 100 views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="w-full">
        <TabsList>
          <TabsTrigger value="views">Views Over Time</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Views {timeRange === "weekly" ? "Last 7 Days" : timeRange === "monthly" ? "Last 30 Days" : "This Year"}</CardTitle>
              <CardDescription>Track how your blog views are performing over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoadingStats ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Loading view statistics...</p>
                  </div>
                ) : viewStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={viewStats}>
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
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>No view data available for the selected period.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments by Blog</CardTitle>
              <CardDescription>Number of comments on each of your blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoadingBlogs ? (
                  <div className="flex h-full items-center justify-center">
                    <p>Loading comment statistics...</p>
                  </div>
                ) : blogs.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topPosts}>
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="comments" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p>No comment data available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your most viewed blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isLoadingBlogs ? (
              <div className="flex h-full items-center justify-center">
                <p>Loading top posts...</p>
              </div>
            ) : topPosts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPosts} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="title" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p>No blog posts available.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
