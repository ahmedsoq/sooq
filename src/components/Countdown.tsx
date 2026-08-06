import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

const KEY = "elsoooq_offer_end_v1";

function getEnd(hours: number) {
  const span = Math.max(1, hours) * 3600 * 1000;
  try {
    const raw = Number(localStorage.getItem(KEY));
    if (raw && raw > Date.now()) return raw;
  } catch {
    /* ignore */
  }
  const end = Date.now() + span;
  try {
    localStorage.setItem(KEY, String(end));
  } catch {
    /* ignore */
  }
  return end;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ hours, title }: { hours: number; title: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = getEnd(hours);
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [hours]);

  if (left === null) return null;

  const total = Math.floor(left / 1000);
  const parts = [
    { v: Math.floor(total / 3600), l: "ساعة" },
    { v: Math.floor((total % 3600) / 60), l: "دقيقة" },
    { v: total % 60, l: "ثانية" },
  ];

  return (
    <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-3">
      <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-accent">
        <Timer className="size-3.5" /> {title}
      </p>
      <div dir="ltr" className="mt-2 flex items-center justify-center gap-2">
        {parts.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="min-w-14 rounded-xl bg-secondary px-2 py-1.5 text-center">
              <p className="text-2xl font-black tabular-nums gold-text">{pad(p.v)}</p>
              <p className="text-[10px] text-muted-foreground">{p.l}</p>
            </div>
            {i < parts.length - 1 && <span className="text-xl font-black text-accent">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
