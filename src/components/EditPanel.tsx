import { useRef } from "react";
import { RotateCcw, Upload, X } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

type Props = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
  reset: () => void;
  onClose: () => void;
};

export function EditPanel({ content, update, reset, onClose }: Props) {
  return (
    <aside className="fixed inset-y-0 left-0 z-60 w-full max-w-md overflow-y-auto border-r border-border bg-card p-4 shadow-2xl sm:w-[26rem]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold">لوحة التعديل</h3>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-xl bg-secondary px-3 py-2 text-xs"
          >
            <RotateCcw className="size-3.5" /> استرجاع الأصلي
          </button>
          <button onClick={onClose} className="rounded-xl bg-secondary p-2" aria-label="إغلاق">
            <X className="size-4" />
          </button>
        </div>
      </div>
      <p className="mb-4 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
        كل التعديلات تُحفظ تلقائياً على هذا الجهاز. افتح اللوحة في أي وقت بإضافة{" "}
        <span className="gold-text font-bold">?edit=1</span> في نهاية رابط الموقع.
      </p>

      <Section title="الهوية والعروض">
        <T label="اسم الموقع" v={content.brand} on={(v) => update({ brand: v })} />
        <T label="سطر تحت الاسم" v={content.brandTag} on={(v) => update({ brandTag: v })} />
        <T label="الشريط المتحرك" v={content.announce} on={(v) => update({ announce: v })} />
      </Section>

      <Section title="القسم الرئيسي">
        <T label="شارة أعلى العنوان" v={content.heroBadge} on={(v) => update({ heroBadge: v })} />
        <T label="العنوان" v={content.heroTitle} on={(v) => update({ heroTitle: v })} />
        <T
          label="الوصف"
          area
          v={content.heroSubtitle}
          on={(v) => update({ heroSubtitle: v })}
        />
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

      <Section title="الصور">
        {content.images.map((img, i) => (
          <div key={i} className="mb-3 rounded-xl bg-secondary/50 p-3">
            <img src={img.src} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
            <ImagePicker
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

function ImagePicker({ onPick }: { onPick: (src: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="mb-2 flex gap-2">
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-xs"
      >
        <Upload className="size-3.5" /> رفع صورة
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onPick(String(reader.result));
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}
