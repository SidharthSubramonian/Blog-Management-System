
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/50 py-8">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold">ScribeSphere</h3>
          <p className="text-sm text-muted-foreground">
            A platform for sharing your ideas, stories, and knowledge with the world.
          </p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-medium">Navigation</h3>
          <nav className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link to="/blogs" className="text-sm text-muted-foreground hover:text-foreground">
              Blogs
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-medium">Resources</h3>
          <nav className="flex flex-col gap-2">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
              Help Center
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-medium">Contact</h3>
          <p className="text-sm text-muted-foreground">
            Have questions or feedback? Contact us at support@scribesphere.com
          </p>
        </div>
      </div>
      
      <div className="container mt-8 border-t pt-4">
        <p className="text-center text-sm text-muted-foreground">
          © {currentYear} ScribeSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
