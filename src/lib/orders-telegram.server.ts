import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(300),
  governorate: z.string().trim().min(2).max(40),
  center: z.string().trim().max(60).optional(),
  quantity: z.number().int().min(1).max(20),
  unitPrice: z.number().min(0).max(1000000),
  shipping: z.number().min(0).max(100000),
  total: z.number().min(0).max(10000000),
  productName: z.string().trim().max(120).optional(),
  botToken: z.string().trim().max(120).optional(),
  chatId: z.string().trim().max(64).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const testSchema = z.object({
  botToken: z.string().trim().min(20).max(120),
  chatId: z.string().trim().max(64).optional(),
});

const GATEWAY = "https://connector-gateway.lovable.dev/telegram";

type TgResponse = { ok: boolean; result?: unknown; description?: string };

/** استدعاء تليجرام: بالتوكن الخاص لو موجود، وإلا عبر الجيت واي */
export async function tg(method: string, body: unknown, botToken?: string): Promise<TgResponse> {
  let url: string;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (botToken) {
    url = `https://api.telegram.org/bot${botToken}/${method}`;
  } else {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connKey = process.env["TELEGRAM_API_KEY"];
    if (!lovableKey || !connKey) throw new Error("not_configured");
    url = `${GATEWAY}/${method}`;
    headers["Authorization"] = `Bearer ${lovableKey}`;
    headers["X-Connection-Api-Key"] = connKey;
  }

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  let json: TgResponse;
  try {
    json = JSON.parse(text) as TgResponse;
  } catch {
    throw new Error(`Telegram ${method} [${res.status}]: ${text.slice(0, 200)}`);
  }
  if (!res.ok || json.ok === false) {
    throw new Error(`Telegram ${method} [${res.status}]: ${json.description ?? text.slice(0, 200)}`);
  }
  return json;
}

/** لو مفيش chat id محفوظ، نحاول نجيبه من آخر رسالة وصلت للبوت */
export async function resolveChatId(botToken?: string): Promise<string | null> {
  try {
    const updates = (await tg("getUpdates", {}, botToken)) as {
      result?: Array<{ message?: { chat?: { id?: number } } }>;
    };
    const last = updates.result?.filter((u) => u.message?.chat?.id).pop();
    return last?.message?.chat?.id ? String(last.message.chat.id) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function buildOrderMessage(data: OrderInput) {
  return [
    "🛒 <b>طلب جديد من elsoooq</b>",
    "",
    `👤 الاسم: ${data.name}`,
    `📞 التليفون: ${data.phone}`,
    `🏙️ المحافظة: ${data.governorate}`,
    ...(data.center ? [`🏘️ المركز/المدينة: ${data.center}`] : []),
    `📍 العنوان: ${data.address}`,
    `📦 المنتج: ${data.productName ?? "كاميرا مراقبة جيب لاسلكية"}`,
    `🔢 عدد القطع: ${data.quantity}`,
    `💵 سعر القطعة: ${data.unitPrice} ج.م`,
    `🚚 الشحن: ${data.shipping === 0 ? "مجاني" : `${data.shipping} ج.م`}`,
    `💰 الإجمالي: <b>${data.total} ج.م</b>`,
    "💳 الدفع عند الاستلام",
  ].join("\n");
}
