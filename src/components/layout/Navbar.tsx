
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LogIn, Menu, X, Plus, UserRound, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Successfully logged out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-blog-primary">
              ScribeSphere
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link to="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/blogs" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Blogs
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/new-blog">
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <UserRound className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-50 bg-background p-6 flex flex-col md:hidden",
          isOpen ? "block animate-fade-in" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-4">
          <Link 
            to="/" 
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/blogs" 
            className="text-lg font-medium"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className="text-lg font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="mt-6 flex flex-col gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="outline">
                <Link to="/new-blog" onClick={() => setIsOpen(false)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Blog
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={user.image || ""} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
