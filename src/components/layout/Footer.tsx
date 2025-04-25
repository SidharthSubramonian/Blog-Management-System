
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Please enter your message");
      return;
    }
    
    toast.success("Your message has been sent! We'll get back to you soon.");
    setMessage("");
  };
  
  return (
    <footer className="border-t bg-background/50 py-8">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold">ScribeSphere</h3>
          <p className="text-sm text-muted-foreground">
            A platform for sharing your ideas, stories, and knowledge with the world.
          </p>
          
          <form onSubmit={handleSubscribe} className="mt-4">
            <p className="mb-2 text-sm font-medium">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-[200px]"
              />
              <Button type="submit" size="sm">Subscribe</Button>
            </div>
          </form>
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
            <a 
              href="https://github.com/scribesphere"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub Repository
            </a>
            <a 
              href="https://docs.scribesphere.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Documentation
            </a>
          </nav>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-medium">Contact</h3>
          <p className="text-sm text-muted-foreground">
            Have questions or feedback?
          </p>
          <form onSubmit={handleContactSubmit} className="mt-2 space-y-2">
            <Input
              as="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
              className="h-20 resize-none"
            />
            <Button type="submit" size="sm" className="w-full">
              Send Message
            </Button>
          </form>
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
