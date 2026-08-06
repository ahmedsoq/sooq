import { useEffect, useState } from "react";
import { ShoppingBag, X } from "lucide-react";

const NAMES = [
  "أحمد",
  "محمود",
  "مصطفى",
  "سارة",
  "منى",
  "كريم",
  "إسلام",
  "هبة",
  "عمرو",
  "ياسمين",
  "خالد",
  "فاطمة",
  "حسن",
  "نورا",
];

const CITIES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "المنصورة",
  "طنطا",
  "أسيوط",
  "الزقازيق",
  "المنيا",
  "بورسعيد",
  "الفيوم",
  "سوهاج",
  "دمياط",
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function LiveOrders({ productName }: { productName: string }) {
  const [item, setItem] = useState<{ name: string; city: string; mins: number } | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    let hide: ReturnType<typeof setTimeout>;
    let next: ReturnType<typeof setTimeout>;

    const show = () => {
      setItem({ name: pick(NAMES), city: pick(CITIES), mins: 1 + Math.floor(Math.random() * 9) });
      hide = setTimeout(() => setItem(null), 5000);
      next = setTimeout(show, 5000 + 8000 + Math.random() * 9000);
    };

    const start = setTimeout(show, 4000);
    return () => {
      clearTimeout(start);
      clearTimeout(hide);
      clearTimeout(next);
    };
  }, [closed]);

  if (closed || !item) return null;

  return (
    <div className="fixed bottom-24 right-3 z-40 max-w-[calc(100vw-1.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass flex items-center gap-3 rounded-2xl border border-border/60 px-3 py-2.5 shadow-2xl">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <ShoppingBag className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-bold">
            {item.name} من {item.city} طلب للتو
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {productName} · منذ {item.mins} دقيقة
          </p>
        </div>
        <button
          onClick={() => setClosed(true)}
          aria-label="إغلاق الإشعارات"
          className="shrink-0 rounded-lg p-1 text-muted-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
