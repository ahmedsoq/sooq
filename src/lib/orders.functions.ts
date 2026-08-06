import { createServerFn } from "@tanstack/react-start";
import {
  orderSchema,
  testSchema,
  tg,
  resolveChatId,
  buildOrderMessage,
} from "./orders-telegram.server";

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const botToken = data.botToken || process.env["TELEGRAM_BOT_TOKEN"] || undefined;

    if (!botToken && !(process.env["LOVABLE_API_KEY"] && process.env["TELEGRAM_API_KEY"])) {
      return { ok: true as const, notified: false, reason: "not_configured" };
    }

    let chatId = data.chatId || process.env["TELEGRAM_CHAT_ID"] || "";
    if (!chatId) chatId = (await resolveChatId(botToken)) ?? "";
    if (!chatId) {
      console.error("No Telegram chat id. Send /start to the bot or set chat id in admin panel.");
      return { ok: true as const, notified: false, reason: "no_chat_id" };
    }

    try {
      await tg(
        "sendMessage",
        { chat_id: chatId, text: buildOrderMessage(data), parse_mode: "HTML" },
        botToken,
      );
      return { ok: true as const, notified: true };
    } catch (e) {
      console.error(e);
      return { ok: true as const, notified: false, reason: "send_failed" };
    }
  });

export const testTelegram = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => testSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      let chatId = data.chatId || "";
      if (!chatId) chatId = (await resolveChatId(data.botToken)) ?? "";
      if (!chatId) {
        return {
          ok: false as const,
          message: "لم نجد Chat ID. افتح البوت على تليجرام واضغط /start ثم جرّب مرة أخرى.",
        };
      }
      await tg(
        "sendMessage",
        { chat_id: chatId, text: "✅ تم ربط بوت تليجرام بنجاح. إشعارات الطلبات هتوصلك هنا." },
        data.botToken,
      );
      return { ok: true as const, message: `تم إرسال رسالة تجريبية بنجاح (Chat ID: ${chatId})` };
    } catch (e) {
      return { ok: false as const, message: e instanceof Error ? e.message : "فشل الإرسال" };
    }
  });
