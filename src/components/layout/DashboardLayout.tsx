
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/sonner";

export function DashboardLayout() {
  // Mock user, replace with actual auth integration
  const user = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
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
