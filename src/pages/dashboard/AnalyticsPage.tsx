
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "@/lib/api";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Eye, MessageSquare, BarChart2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for charts
const weeklyViewsData = [
  { day: "Mon", views: 45, comments: 5 },
  { day: "Tue", views: 62, comments: 7 },
  { day: "Wed", views: 58, comments: 8 },
  { day: "Thu", views: 71, comments: 10 },
  { day: "Fri", views: 83, comments: 12 },
  { day: "Sat", views: 99, comments: 14 },
  { day: "Sun", views: 87, comments: 11 },
];

const monthlyViewsData = [
  { month: "Jan", views: 1245, comments: 145 },
  { month: "Feb", views: 1358, comments: 165 },
  { month: "Mar", views: 1859, comments: 190 },
  { month: "Apr", views: 1725, comments: 213 },
  { month: "May", views: 2458, comments: 257 },
  { month: "Jun", views: 2798, comments: 290 },
  { month: "Jul", views: 3264, comments: 312 },
  { month: "Aug", views: 3147, comments: 301 },
  { month: "Sep", views: 2879, comments: 276 },
  { month: "Oct", views: 2534, comments: 241 },
  { month: "Nov", views: 2390, comments: 198 },
  { month: "Dec", views: 2871, comments: 267 },
];

const topPostsData = [
  { title: "Getting Started with React", views: 2145, comments: 87 },
  { title: "CSS Grid Layout Tutorial", views: 1876, comments: 62 },
  { title: "JavaScript Promises Explained", views: 1543, comments: 58 },
  { title: "Introduction to TypeScript", views: 1321, comments: 45 },
  { title: "The Future of Web Development", views: 1298, comments: 51 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("weekly");
  
  const { data: blogs = [] } = useQuery({
    queryKey: ['analytics-blogs'],
    queryFn: () => fetchBlogs({ limit: 50 })
  });

  // Calculate total stats
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.view_count || 0), 0);
  const totalComments = blogs.reduce((sum, blog) => sum + ((blog.comments && blog.comments[0]?.count) || 0), 0);
  
  // Get chart data based on selected time range
  const chartData = timeRange === "weekly" ? weeklyViewsData : monthlyViewsData;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Last 7 days</SelectItem>
            <SelectItem value="monthly">This year</SelectItem>
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
              {timeRange === "weekly" 
                ? `+${weeklyViewsData.reduce((sum, day) => sum + day.views, 0)} this week`
                : `+${monthlyViewsData.slice(-3).reduce((sum, month) => sum + month.views, 0)} last quarter`
              }
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
              {timeRange === "weekly" 
                ? `+${weeklyViewsData.reduce((sum, day) => sum + day.comments, 0)} this week`
                : `+${monthlyViewsData.slice(-3).reduce((sum, month) => sum + month.comments, 0)} last quarter`
              }
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
          <TabsTrigger value="comments">Comments Over Time</TabsTrigger>
        </TabsList>
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Views {timeRange === "weekly" ? "This Week" : "This Year"}</CardTitle>
              <CardDescription>Track how your blog views are performing over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey={timeRange === "weekly" ? "day" : "month"} 
                    />
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
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comments {timeRange === "weekly" ? "This Week" : "This Year"}</CardTitle>
              <CardDescription>Track how user engagement is performing over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey={timeRange === "weekly" ? "day" : "month"} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your most viewed and commented blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPostsData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
