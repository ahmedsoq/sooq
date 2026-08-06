import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { getMediaUrl, IDB_PREFIX } from "@/lib/media-store";

type Props = {
  src: string;
  poster?: string;
  title: string;
  /** نسبة العرض للطول: "square" | "video" | "portrait" */
  ratio?: "square" | "video" | "portrait";
  fit?: "cover" | "contain";
};

const ratios: Record<string, string> = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[9/16]",
};

export function ProductVideo({ src, poster, title, ratio = "video", fit = "contain" }: Props) {
  const [resolved, setResolved] = useState(src.startsWith(IDB_PREFIX) ? "" : src);

  useEffect(() => {
    let url = "";
    let cancelled = false;
    if (src.startsWith(IDB_PREFIX)) {
      setResolved("");
      getMediaUrl(src).then((u) => {
        if (cancelled || !u) return;
        url = u;
        setResolved(u);
      });
    } else {
      setResolved(src);
    }
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);

  if (!src || !resolved) return null;
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com|facebook\.com|drive\.google\.com/.test(
    resolved,
  );
  const embedSrc = toEmbedUrl(resolved);

  return (
    <section className="glass rounded-3xl p-4">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-black gold-text">
        <PlayCircle className="size-5" /> {title}
      </h2>
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-black ${ratios[ratio] ?? "aspect-video"}`}
      >
        {isEmbed ? (
          <iframe
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <video
            src={resolved}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className={`absolute inset-0 size-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
          />
        )}
      </div>
    </section>
  );
}

/** تحويل روابط يوتيوب/درايف إلى روابط تشغيل مضمّنة */
function toEmbedUrl(url: string): string {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
}
