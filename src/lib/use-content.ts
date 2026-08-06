import { useCallback, useEffect, useRef, useState } from "react";
import { defaultContent, type SiteContent } from "./site-content";

const KEY = "elsoooq_content_v1";

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hydrated, setHydrated] = useState(false);
  const latest = useRef<SiteContent>(defaultContent);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const next = { ...defaultContent, ...(JSON.parse(raw) as SiteContent) };
        latest.current = next;
        setContent(next);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<SiteContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      latest.current = next;
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const saveAll = useCallback(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(latest.current));
      return true;
    } catch {
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    latest.current = defaultContent;
    setContent(defaultContent);
  }, []);

  return { content, update, reset, saveAll, hydrated };
}
