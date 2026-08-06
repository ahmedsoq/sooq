import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

// الرقم السري للدخول إلى لوحة التحكم — غيّره من هنا
export const ADMIN_PIN = "2468";
const STORAGE_KEY = "elsoooq_admin_ok";

/**
 * دخول مخفي: 7 نقرات سريعة على اسم المتجر (أو ?panel=1 في الرابط)
 * ثم إدخال الرقم السري.
 */
export function useHiddenAdmin() {
  const [askPin, setAskPin] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const taps = useRef<number[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    if (new URLSearchParams(window.location.search).has("panel")) setAskPin(true);
  }, []);

  const secretTap = () => {
    const now = Date.now();
    taps.current = [...taps.current, now].filter((t) => now - t < 3000);
    if (taps.current.length >= 7) {
      taps.current = [];
      if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      } else {
        setAskPin(true);
      }
    }
  };

  const submitPin = (pin: string) => {
    if (pin !== ADMIN_PIN) return false;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setAskPin(false);
    setUnlocked(true);
    return true;
  };

  return {
    askPin,
    unlocked,
    secretTap,
    submitPin,
    closePin: () => setAskPin(false),
    lock: () => setUnlocked(false),
  };
}

export function PinDialog({
  onSubmit,
  onClose,
}: {
  onSubmit: (pin: string) => boolean;
  onClose: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          if (!onSubmit(pin)) {
            setError(true);
            setPin("");
          }
        }}
        className="glass w-full max-w-xs space-y-4 rounded-3xl p-5 text-center"
      >
        <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-secondary">
          <Lock className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-bold">أدخل الرقم السري</p>
        <input
          autoFocus
          inputMode="numeric"
          type="password"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          className="w-full rounded-2xl bg-secondary px-4 py-3 text-center text-lg tracking-[0.5em] outline-none"
          placeholder="••••"
        />
        {error && <p className="text-xs font-semibold text-destructive">رقم سري غير صحيح</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-secondary px-4 py-2.5 text-sm font-bold text-muted-foreground"
          >
            إلغاء
          </button>
          <button type="submit" className="flex-1 rounded-2xl gold-fill px-4 py-2.5 text-sm font-black">
            دخول
          </button>
        </div>
      </form>
    </div>
  );
}
