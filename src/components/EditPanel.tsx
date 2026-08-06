import { useRef, useState } from "react";
import { Check, Loader2, RotateCcw, Save, Send, Upload, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { testTelegram } from "@/lib/orders.functions";
import { uploadSiteMedia } from "@/lib/media-store";
import type { SiteContent } from "@/lib/site-content";

type Props = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  reset: () => void | Promise<unknown>;
  saveAll: () => Promise<boolean>;
  onClose: () => void;
};

export function EditPanel({ content, update, reset, saveAll, onClose }: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await saveAll();
    setSaving(false);
    if (!ok) {
      alert("تعذر حفظ التعديلات على السيرفر. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-60 w-full max-w-md overflow-y-auto border-r border-border bg-card p-4 shadow-2xl sm:w-[26rem]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">لوحة التعديل</h3>
        <div className="flex gap-2">
          <button
            onClick={() => void reset()}
            className="flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs"
          >
            <RotateCcw className="size-3.5" /> استرجاع الأصلي
          </button>
          <button onClick={onClose} className="rounded-xl bg-secondary p-2" aria-label="إغلاق">
            <X className="size-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => void handleSave()}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> جاري الحفظ...
          </>
        ) : saved ? (
          <>
            <Check className="size-4" /> تم حفظ كل التعديلات
          </>
        ) : (
          <>
            <Save className="size-4" /> حفظ كل التعديلات
          </>
        )}
      </button>

      <p className="mb-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
        بعد الضغط على «حفظ كل التعديلات» يتم الحفظ على السيرفر وتظهر التعديلات في الموقع كله ولكل
        الزوار. للدخول لاحقاً: اضغط 7 مرات متتالية على اسم المتجر بالأعلى ثم أدخل{" "}
        <span className="gold-text font-bold">الرقم السري</span>.
      </p>


      <Section title="الهوية والعروض">
        <T label="اسم الموقع" v={content.brand} on={(v) => update({ brand: v })} />
        <T label="سطر تحت الاسم" v={content.brandTag} on={(v) => update({ brandTag: v })} />
        <T label="الشريط المتحرك" v={content.announce} on={(v) => update({ announce: v })} />
      </Section>

      <Section title="القسم الرئيسي">
        <T label="شارة أعلى العنوان" v={content.heroBadge} on={(v) => update({ heroBadge: v })} />
        <T label="العنوان" v={content.heroTitle} on={(v) => update({ heroTitle: v })} />
        <T label="الوصف" area v={content.heroSubtitle} on={(v) => update({ heroSubtitle: v })} />
        <T label="نص زر الطلب" v={content.ctaText} on={(v) => update({ ctaText: v })} />
        <T label="نص الكمية المتبقية" v={content.stockText} on={(v) => update({ stockText: v })} />
      </Section>

      <Section title="الأسعار">
        <N label="السعر قبل" v={content.oldPrice} on={(v) => update({ oldPrice: v })} />
        <N label="السعر الآن" v={content.price} on={(v) => update({ price: v })} />
        <N label="رسوم التوصيل" v={content.shippingFee} on={(v) => update({ shippingFee: v })} />
        <T label="نص الشحن" v={content.shippingText} on={(v) => update({ shippingText: v })} />
        <T label="ملاحظة تحت السعر" v={content.priceNote} on={(v) => update({ priceNote: v })} />
      </Section>

      <Section title="العد التنازلي والإشعارات">
        <T
          label="نص العد التنازلي"
          v={content.countdownTitle}
          on={(v) => update({ countdownTitle: v })}
        />
        <N
          label="مدة العرض بالساعات"
          v={content.countdownHours}
          on={(v) => update({ countdownHours: v })}
        />
        <label className="mb-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={content.liveOrders}
            onChange={(e) => update({ liveOrders: e.target.checked })}
          />
          تفعيل إشعارات الطلبات الحية
        </label>
      </Section>

      <Section title="فيديو المنتج">
        <T label="عنوان القسم" v={content.videoTitle} on={(v) => update({ videoTitle: v })} />
        <T
          label="رابط الفيديو (يوتيوب أو رابط mp4)"
          v={content.videoSrc}
          on={(v) => update({ videoSrc: v })}
        />
        <FilePicker
          accept="video/*"
          label="رفع فيديو من الجهاز"
          maxMb={120}
          onPick={(src) => update({ videoSrc: src })}
        />
        {content.videoSrc && (
          <p className="mb-2 rounded-lg bg-secondary/60 p-2 text-[11px] text-muted-foreground">
            ✅ يوجد فيديو محفوظ حالياً
          </p>
        )}
        <FilePicker
          accept="image/*"
          label="رفع صورة غلاف للفيديو"
          onPick={(src) => update({ videoPoster: src })}
        />
        <S
          label="مقاس الفيديو"
          v={content.videoRatio}
          on={(v) => update({ videoRatio: v as typeof content.videoRatio })}
          options={[
            ["video", "عرضي 16:9"],
            ["square", "مربع 1:1"],
            ["portrait", "طولي 9:16 (ريلز)"],
          ]}
        />
        <S
          label="طريقة العرض"
          v={content.videoFit}
          on={(v) => update({ videoFit: v as typeof content.videoFit })}
          options={[
            ["contain", "إظهار الفيديو كامل"],
            ["cover", "ملء الإطار (قص الأطراف)"],
          ]}
        />
        {content.videoSrc && (
          <button
            onClick={() => {
              update({ videoSrc: "", videoPoster: "" });
            }}
            className="mb-2 rounded-lg bg-secondary px-3 py-2 text-xs"
          >
            حذف الفيديو
          </button>
        )}
      </Section>

      <Section title="إشعارات تليجرام">
        <p className="mb-2 rounded-lg bg-secondary/60 p-2 text-[11px] leading-5 text-muted-foreground">
          افتح <b>@BotFather</b> على تليجرام واعمل بوت جديد بأمر /newbot وانسخ التوكن هنا، ثم افتح
          البوت واضغط <b>Start</b> عشان توصلك الطلبات.
        </p>
        <T
          label="توكن البوت (Bot Token)"
          v={content.telegramToken}
          on={(v) => update({ telegramToken: v.trim() })}
        />
        <T
          label="Chat ID (اختياري - يتم اكتشافه تلقائياً)"
          v={content.telegramChatId}
          on={(v) => update({ telegramChatId: v.trim() })}
        />
        <TelegramTest token={content.telegramToken} chatId={content.telegramChatId} />
      </Section>

      <Section title="الصور">
        <S
          label="مقاس معرض الصور"
          v={content.imageRatio}
          on={(v) => update({ imageRatio: v as typeof content.imageRatio })}
          options={[
            ["square", "مربع 1:1"],
            ["video", "عرضي 16:9"],
            ["portrait", "طولي 9:16"],
          ]}
        />
        <S
          label="طريقة عرض الصور"
          v={content.imageFit}
          on={(v) => update({ imageFit: v as typeof content.imageFit })}
          options={[
            ["cover", "ملء الإطار (قص الأطراف)"],
            ["contain", "إظهار الصورة كاملة"],
          ]}
        />
        {content.images.map((img, i) => (
          <div key={i} className="mb-3 rounded-xl bg-secondary/50 p-3">
            <img src={img.src} alt="" className="mb-2 h-24 w-full rounded-lg object-contain" />
            <FilePicker
              accept="image/*"
              label="رفع صورة"
              onPick={(src) => {
                const next = [...content.images];
                next[i] = { ...next[i]!, src };
                update({ images: next });
              }}
            />
            <T
              label="التعليق"
              v={img.caption}
              on={(v) => {
                const next = [...content.images];
                next[i] = { ...next[i]!, caption: v };
                update({ images: next });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="المواصفات">
        <T label="عنوان القسم" v={content.specsTitle} on={(v) => update({ specsTitle: v })} />
        {content.specs.map((s, i) => (
          <div key={i} className="mb-3 rounded-xl bg-secondary/50 p-3">
            <T
              label={`الميزة ${i + 1}`}
              v={s.title}
              on={(v) => {
                const next = [...content.specs];
                next[i] = { ...next[i]!, title: v };
                update({ specs: next });
              }}
            />
            <T
              label="الوصف"
              area
              v={s.desc}
              on={(v) => {
                const next = [...content.specs];
                next[i] = { ...next[i]!, desc: v };
                update({ specs: next });
              }}
            />
          </div>
        ))}
      </Section>

      <Section title="التواصل">
        <T label="عنوان القسم" v={content.contactTitle} on={(v) => update({ contactTitle: v })} />
        <T
          label="سطر توضيحي"
          v={content.contactSubtitle}
          on={(v) => update({ contactSubtitle: v })}
        />
        <T label="رقم واتساب" v={content.whatsapp} on={(v) => update({ whatsapp: v })} />
        <T label="رقم الاتصال" v={content.phone} on={(v) => update({ phone: v })} />
        <T label="رابط فيسبوك" v={content.facebook} on={(v) => update({ facebook: v })} />
      </Section>

      <Section title="نموذج الطلب والرسائل">
        <T label="عنوان النموذج" v={content.formTitle} on={(v) => update({ formTitle: v })} />
        <T label="عنوان النجاح" v={content.successTitle} on={(v) => update({ successTitle: v })} />
        <T label="رسالة النجاح" area v={content.successMsg} on={(v) => update({ successMsg: v })} />
        <T label="الفوتر" v={content.footer} on={(v) => update({ footer: v })} />
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="mb-3 rounded-2xl border border-border p-3">
      <summary className="cursor-pointer text-sm font-bold gold-text">{title}</summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

const cls =
  "w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus:border-primary";

function T({
  label,
  v,
  on,
  area,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  area?: boolean;
}) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      {area ? (
        <textarea className={cls} rows={2} value={v} onChange={(e) => on(e.target.value)} />
      ) : (
        <input className={cls} value={v} onChange={(e) => on(e.target.value)} />
      )}
    </label>
  );
}

function N({ label, v, on }: { label: string; v: number; on: (v: number) => void }) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        className={cls}
        value={v}
        onChange={(e) => on(Number(e.target.value) || 0)}
      />
    </label>
  );
}

function S({
  label,
  v,
  on,
  options,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <select className={cls} value={v} onChange={(e) => on(e.target.value)}>
        {options.map(([val, txt]) => (
          <option key={val} value={val}>
            {txt}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilePicker({
  onPick,
  accept,
  label,
  maxMb = 4,
}: {
  onPick: (src: string) => void;
  accept: string;
  label: string;
  maxMb?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="mb-2 flex gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => ref.current?.click()}
        className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
        {busy ? "جاري الرفع..." : label}
      </button>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > maxMb * 1024 * 1024) {
            alert(
              `الملف كبير جداً (الحد ${maxMb} ميجا). ارفعه على يوتيوب وضع الرابط بدلاً من ذلك.`,
            );
            return;
          }
          setBusy(true);
          try {
            const url = await uploadSiteMedia(file);
            onPick(url);
          } catch (err) {
            console.error(err);
            alert("تعذر رفع الملف. حاول مرة أخرى أو استخدم رابط خارجي.");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

function TelegramTest({ token, chatId }: { token: string; chatId: string }) {
  const run = useServerFn(testTelegram);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="mb-2">
      <button
        type="button"
        disabled={busy || token.trim().length < 20}
        onClick={async () => {
          setBusy(true);
          setMsg("");
          try {
            const r = await run({ data: { botToken: token.trim(), chatId: chatId || undefined } });
            setMsg(r.message);
          } catch {
            setMsg("فشل الاتصال بالبوت، تأكد من التوكن.");
          } finally {
            setBusy(false);
          }
        }}
        className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs disabled:opacity-50"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
        إرسال رسالة تجريبية
      </button>
      {msg && <p className="mt-2 text-[11px] text-muted-foreground">{msg}</p>}
    </div>
  );
}
