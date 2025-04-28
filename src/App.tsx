
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as ToastToaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

// Layout components
import { Layout } from "./components/layout/Layout";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Main pages
import HomePage from "./pages/HomePage";
import BlogsPage from "./pages/BlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DocumentationPage from "./pages/DocumentationPage";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// Dashboard pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import MyBlogsPage from "./pages/dashboard/MyBlogsPage";
import CommentsPage from "./pages/dashboard/CommentsPage";
import TagsPage from "./pages/dashboard/TagsPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Blog management pages
import NewBlogPage from "./pages/blog/NewBlogPage";
import EditBlogPage from "./pages/blog/EditBlogPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <ToastToaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes with main layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:id" element={<BlogDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/documentation" element={<DocumentationPage />} />
              </Route>
              
              {/* Dashboard routes with dashboard layout */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/blogs" element={<MyBlogsPage />} />
                <Route path="/dashboard/blogs/edit/:id" element={<EditBlogPage />} />
                <Route path="/dashboard/comments" element={<CommentsPage />} />
                <Route path="/dashboard/tags" element={<TagsPage />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
                <Route path="/new-blog" element={<NewBlogPage />} />
              </Route>
              
              {/* Catch all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
