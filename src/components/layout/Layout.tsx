
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Add theme detection
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Only redirect to login if needed (not for public pages)
  useEffect(() => {
    const publicPaths = ['/', '/blogs', '/login', '/signup'];
    const isPublicPath = publicPaths.some(path => 
      window.location.pathname === path || window.location.pathname.startsWith('/blogs/'));
    
    if (!loading && !user && !isPublicPath) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user ? {
        id: user.id,
        name: user.email || "",
        email: user.email || "",
        image: user.user_metadata?.avatar_url
      } : null} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
