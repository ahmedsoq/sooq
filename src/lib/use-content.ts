import { useCallback, useEffect, useState } from "react";
import { defaultContent, type SiteContent } from "./site-content";

const KEY = "elsoooq_content_v1";

export function useContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setContent({ ...defaultContent, ...(JSON.parse(raw) as SiteContent) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<SiteContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setContent(defaultContent);
  }, []);

  return { content, update, reset, hydrated };
}
