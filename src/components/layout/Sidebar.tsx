
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Tag, 
  BarChart2, 
  LogOut, 
  Settings
} from "lucide-react";

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/blogs", icon: FileText, label: "My Blogs" },
  { href: "/dashboard/comments", icon: MessageSquare, label: "Comments" },
  { href: "/dashboard/tags", icon: Tag, label: "Tags" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-56 border-r bg-background/80 backdrop-blur-md lg:block">
      <nav className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        
        <div className="mt-auto">
          <Link
            to="/logout"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
}
