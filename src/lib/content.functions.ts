import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_PIN_FALLBACK = "2468";

function checkPin(pin: string) {
  const expected = process.env["ADMIN_PIN"] || ADMIN_PIN_FALLBACK;
  if (pin !== expected) throw new Error("unauthorized");
}

/** قراءة محتوى الموقع المحفوظ على السيرفر (يظهر لكل الزوار) */
export const loadContent = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("data")
    .eq("id", "main")
    .maybeSingle();
  if (error) {
    console.error(error);
    return { json: "{}" };
  }
  return { json: JSON.stringify(data?.data ?? {}) };
});

/** حفظ المحتوى على السيرفر — يتطلب الرقم السري */
export const saveContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string(), json: z.string() }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: "main", data: JSON.parse(data.json), updated_at: new Date().toISOString() });
    if (error) {
      console.error(error);
      return { ok: false as const, message: "تعذر حفظ التعديلات على السيرفر." };
    }
    return { ok: true as const, message: "تم حفظ التعديلات لكل الزوار." };
  });

/** إرجاع المحتوى للإعدادات الافتراضية */
export const resetContent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string() }).parse(d))
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("site_content")
      .upsert({ id: "main", data: {}, updated_at: new Date().toISOString() });
    return { ok: true as const };
  });

/** التحقق من الرقم السري */
export const verifyPin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ pin: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PIN"] || ADMIN_PIN_FALLBACK;
    return { ok: data.pin === expected };
  });

/** إنشاء رابط رفع مؤقت لملف (صورة/فيديو) — يتطلب الرقم السري */
export const createMediaUpload = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ pin: z.string(), filename: z.string().min(1) }).parse(d),
  )
  .handler(async ({ data }) => {
    checkPin(data.pin);
    const safe = data.filename.replace(/[^\w.-]/g, "_").slice(-60);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("site-media")
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error("upload_url_failed");
    return { path, token: signed.token, publicPath: `/api/public/media/${path}` };
  });