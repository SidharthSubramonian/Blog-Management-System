import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email }]);
        
      if (error) throw error;
      
      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      toast.error("Failed to subscribe. Please try again later.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      toast.error("Please enter your message");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([{ name, email, message }]);
        
      if (error) throw error;
      
      toast.success("Your message has been sent! We'll get back to you soon.");
      setMessage("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Error sending contact message:", err);
      toast.error("Failed to send message. Please try again later.");
    }
  };
  
  return (
    <footer className="border-t bg-background/50 py-8">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold">Blog.com</h3>
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
            <Link 
              to="/documentation"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Documentation
            </Link>
            <a 
              href="https://github.com/scribesphere"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub Repository
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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="resize-none"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="resize-none"
            />
            <Textarea
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
          © {currentYear} Blog.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
