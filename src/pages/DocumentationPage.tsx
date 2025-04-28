
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen } from "lucide-react";

export default function DocumentationPage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6" />
        <h1 className="font-heading text-3xl font-bold">Documentation</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use Blog.com effectively</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Blog.com is a platform for sharing your ideas, stories, and knowledge with the world. Here's how to get started:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create an account or sign in</li>
              <li>Access your dashboard</li>
              <li>Create your first blog post</li>
              <li>Share and engage with the community</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Writing and Publishing</CardTitle>
            <CardDescription>Tips for creating engaging content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Follow these guidelines to create engaging blog posts:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choose a clear and concise title</li>
              <li>Add relevant tags to improve discoverability</li>
              <li>Include a cover image to make your post stand out</li>
              <li>Preview your post before publishing</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Your Content</CardTitle>
            <CardDescription>Organize and track your blogs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Keep your content organized with these features:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View all your posts in the dashboard</li>
              <li>Track views and engagement</li>
              <li>Manage comments on your posts</li>
              <li>Edit and update published content</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Guidelines</CardTitle>
            <CardDescription>Be a responsible community member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Help maintain a positive environment by following these guidelines:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be respectful to other users</li>
              <li>Create original content</li>
              <li>Give credit when using others' work</li>
              <li>Report inappropriate content</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Button asChild className="gap-2">
          <a href="https://github.com/scribesphere" target="_blank" rel="noopener noreferrer">
            <BookOpen className="h-4 w-4" />
            View Full Documentation
          </a>
        </Button>
      </div>
    </div>
  );
}
