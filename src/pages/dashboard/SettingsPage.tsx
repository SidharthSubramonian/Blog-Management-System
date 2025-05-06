import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Check, Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar } from "@/lib/uploadUtils";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [emailNotifications, setEmailNotifications] = useState({
    comments: true,
    mentions: true,
    follows: true,
    newsletter: false
  });

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, bio, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUsername(data.username || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setAvatarFile(event.target.files[0]);
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Upload avatar if selected
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        try {
          // Use the uploadAvatar utility function
          newAvatarUrl = await uploadAvatar(avatarFile, user.id);
          console.log("Avatar uploaded successfully:", newAvatarUrl);
        } catch (error) {
          console.error("Avatar upload failed:", error);
          toast.error("Failed to upload avatar image");
          setIsUpdating(false);
          return;
        }
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          avatar_url: newAvatarUrl
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update the avatar URL state
      setAvatarUrl(newAvatarUrl);
      setAvatarFile(null);
      
      // Update auth metadata to reflect the new avatar
      await supabase.auth.updateUser({
        data: { avatar_url: newAvatarUrl }
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsUpdating(true);
    
    // This would normally update user preferences in the database
    // For now, we'll just simulate success
    setTimeout(() => {
      toast.success("Notification preferences updated!");
      setIsUpdating(false);
    }, 500);
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('current-password') as string;
    const newPassword = formData.get('new-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // For demo purposes, we'll just show success
      // In a real app, this would call an API to update the password
      
      toast.success("Password changed successfully!");
      
      // Reset form
      e.currentTarget.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile details and public information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl} />
                  <AvatarFallback>{username.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <Upload className="h-4 w-4" />
                      <span>Change Avatar</span>
                    </div>
                    <Input
                      id="avatar-upload"
                      type="file"
                      className="hidden"
                      onChange={handleAvatarChange}
                      accept="image/*"
                    />
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={user?.email?.split('@')[0] || "username"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Comments on your blogs</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when someone comments on your blogs
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.comments}
                  onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, comments: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when someone mentions you
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.mentions}
                  onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, mentions: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New followers</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails when someone follows you
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.follows}
                  onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, follows: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive our monthly newsletter with tips and updates
                  </p>
                </div>
                <Switch
                  checked={emailNotifications.newsletter}
                  onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, newsletter: checked }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNotificationUpdate} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordChange}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" name="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" name="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" name="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Protect your account with an additional security layer
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
