import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Minus, Plus, X } from "lucide-react";
import { submitOrder } from "@/lib/orders.functions";
import { governorates, type SiteContent } from "@/lib/site-content";

type Props = { content: SiteContent; onClose: () => void };

export function OrderDialog({ content, onClose }: Props) {
  const send = useServerFn(submitOrder);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", address: "", governorate: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const total = content.price * qty + content.shippingFee;

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("من فضلك اكتب الاسم بالكامل");
    if (!/^0?1[0-2,5]\d{8}$/.test(form.phone.trim().replace(/\s/g, "")))
      return setError("رقم تليفون غير صحيح (مثال: 01012345678)");
    if (!form.governorate) return setError("اختر المحافظة");
    if (form.address.trim().length < 5) return setError("اكتب العنوان بالتفصيل");

    setLoading(true);
    try {
      await send({
        data: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          governorate: form.governorate,
          quantity: qty,
          unitPrice: content.price,
          shipping: content.shippingFee,
          total,
          productName: content.heroTitle,
        },
      });
      setDone(true);
    } catch {
      setError("حصل خطأ أثناء الإرسال، حاول مرة أخرى أو تواصل معنا واتساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="glass max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{done ? content.successTitle : content.formTitle}</h3>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-full bg-secondary p-2 text-muted-foreground transition hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-16 text-success" />
            <p className="mt-4 text-xl font-bold text-success">{content.successTitle}</p>
            <p className="mt-2 text-muted-foreground">{content.successMsg}</p>
            <div className="glass mt-5 rounded-2xl p-4 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">عدد القطع</span>
                <span>{qty}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">الإجمالي</span>
                <span className="font-bold gold-text">{total} ج.م</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-2xl gold-fill px-4 py-3 font-bold"
            >
              تمام
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="الاسم بالكامل">
              <input
                className={inputCls}
                value={form.name}
                maxLength={80}
                onChange={(e) => set("name", e.target.value)}
                placeholder="مثال: أحمد محمد"
              />
            </Field>
            <Field label="رقم التليفون">
              <input
                className={inputCls}
                inputMode="tel"
                maxLength={15}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="01012345678"
              />
            </Field>
            <Field label="المحافظة">
              <select
                className={inputCls}
                value={form.governorate}
                onChange={(e) => set("governorate", e.target.value)}
              >
                <option value="">اختر المحافظة</option>
                {governorates.map((g) => (
                  <option key={g} value={g} className="bg-card">
                    {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="العنوان بالتفصيل">
              <textarea
                className={inputCls}
                rows={2}
                maxLength={300}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="المدينة - الشارع - رقم العمارة"
              />
            </Field>

            <Field label="عدد القطع">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="rounded-xl bg-secondary p-2"
                  aria-label="إنقاص"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-10 text-center text-lg font-bold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="rounded-xl bg-secondary p-2"
                  aria-label="زيادة"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </Field>

            <div className="glass rounded-2xl p-4 text-sm">
              <Row label={`سعر المنتج × ${qty}`} value={`${content.price * qty} ج.م`} />
              <Row
                label="رسوم التوصيل"
                value={content.shippingFee === 0 ? "مجاني" : `${content.shippingFee} ج.م`}
              />
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>الإجمالي</span>
                <span className="gold-text">{total} ج.م</span>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/15 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl gold-fill px-4 py-3.5 text-base font-extrabold disabled:opacity-70"
            >
              {loading && <Loader2 className="size-5 animate-spin" />}
              تأكيد الطلب · الدفع عند الاستلام
            </button>
            <p className="text-center text-xs text-muted-foreground">
              لن تدفع أي مبلغ الآن — الدفع كاش عند استلام المنتج
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-secondary/60 px-3 py-2.5 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
