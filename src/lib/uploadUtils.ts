
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads an image file to Supabase storage
 * @param file The file to upload
 * @returns URL of the uploaded image
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;
    
    // Upload the file to the "blog-images" bucket
    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

/**
 * Uploads an avatar image file to Supabase storage
 * @param file The avatar file to upload
 * @param userId The user ID
 * @returns URL of the uploaded avatar
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    // Upload the file to the "avatars" bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}
