import { useCallback, useEffect, useRef, useState } from "react";
import { defaultContent, type SiteContent } from "./site-content";
import { loadContent, resetContent, saveContent } from "./content.functions";
import { getAdminPin } from "@/components/AdminGate";

/**
 * المحتوى محفوظ على السيرفر (Lovable Cloud) وليس على الجهاز،
 * فأي تعديل يتم حفظه يظهر على الموقع كله ولكل الزوار.
 */
export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hydrated, setHydrated] = useState(false);
  const latest = useRef<SiteContent>(defaultContent);

  useEffect(() => {
    let cancelled = false;
    loadContent()
      .then((res) => {
        if (cancelled) return;
        const saved = JSON.parse(res.json) as Partial<SiteContent>;
        const next = { ...defaultContent, ...saved };
        latest.current = next;
        setContent(next);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<SiteContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      latest.current = next;
      return next;
    });
  }, []);

  const saveAll = useCallback(async () => {
    try {
      const res = await saveContent({
        data: { pin: getAdminPin(), json: JSON.stringify(latest.current) },
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      await resetContent({ data: { pin: getAdminPin() } });
    } catch (e) {
      console.error(e);
      return false;
    }
    latest.current = defaultContent;
    setContent(defaultContent);
    return true;
  }, []);

  return { content, update, reset, saveAll, hydrated };
}
