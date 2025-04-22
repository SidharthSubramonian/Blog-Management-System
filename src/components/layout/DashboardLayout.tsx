
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
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
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:pl-56">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
