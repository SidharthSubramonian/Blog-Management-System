
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
      .upload(filePath, file);
      
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
