/**
 * رفع الصور والفيديو إلى تخزين Lovable Cloud حتى تظهر على الموقع
 * لكل الزوار ومن أي جهاز (بدل التخزين المحلي على المتصفح).
 */
import { supabase } from "@/integrations/supabase/client";
import { createMediaUpload } from "./content.functions";
import { getAdminPin } from "@/components/AdminGate";

export async function uploadSiteMedia(file: File): Promise<string> {
  const { path, token, publicPath } = await createMediaUpload({
    data: { pin: getAdminPin(), filename: file.name || "file" },
  });
  const { error } = await supabase.storage.from("site-media").uploadToSignedUrl(path, token, file, {
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw error;
  return publicPath;
}
