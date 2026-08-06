import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const orderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(300),
  governorate: z.string().trim().min(2).max(40),
  quantity: z.number().int().min(1).max(20),
  unitPrice: z.number().min(0).max(1000000),
  shipping: z.number().min(0).max(100000),
  total: z.number().min(0).max(10000000),
  productName: z.string().trim().max(120).optional(),
});

const GATEWAY = "https://connector-gateway.lovable.dev/telegram";

async function tg(path: string, body: unknown, lovableKey: string, connKey: string) {
  const res = await fetch(`${GATEWAY}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Telegram ${path} failed [${res.status}]: ${text}`);
  return JSON.parse(text) as { ok: boolean; result?: unknown; error?: string };
}

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connKey = process.env["TELEGRAM_API_KEY"];
    if (!lovableKey || !connKey) {
      return { ok: false as const, notified: false, reason: "not_configured" };
    }

    let chatId = process.env["TELEGRAM_CHAT_ID"];
    if (!chatId) {
      try {
        const updates = (await tg("getUpdates", {}, lovableKey, connKey)) as {
          result?: Array<{ message?: { chat?: { id?: number } } }>;
        };
        const last = updates.result?.filter((u) => u.message?.chat?.id).pop();
        if (last?.message?.chat?.id) chatId = String(last.message.chat.id);
      } catch (e) {
        console.error(e);
      }
    }

    if (!chatId) {
      console.error("No Telegram chat id resolved. Send /start to the bot.");
      return { ok: true as const, notified: false, reason: "no_chat_id" };
    }

    const lines = [
      "🛒 <b>طلب جديد من elsoooq</b>",
      "",
      `👤 الاسم: ${data.name}`,
      `📞 التليفون: ${data.phone}`,
      `🏙️ المحافظة: ${data.governorate}`,
      `📍 العنوان: ${data.address}`,
      `📦 المنتج: ${data.productName ?? "كاميرا مراقبة جيب لاسلكية"}`,
      `🔢 عدد القطع: ${data.quantity}`,
      `💵 سعر القطعة: ${data.unitPrice} ج.م`,
      `🚚 الشحن: ${data.shipping === 0 ? "مجاني" : `${data.shipping} ج.م`}`,
      `💰 الإجمالي: <b>${data.total} ج.م</b>`,
      "💳 الدفع عند الاستلام",
    ];

    try {
      await tg(
        "sendMessage",
        { chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" },
        lovableKey,
        connKey,
      );
      return { ok: true as const, notified: true };
    } catch (e) {
      console.error(e);
      return { ok: true as const, notified: false, reason: "send_failed" };
    }
  });
