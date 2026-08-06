import { PlayCircle } from "lucide-react";

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
  if (!src) return null;
  const isEmbed = /youtube\.com|youtu\.be|vimeo\.com|facebook\.com|drive\.google\.com/.test(src);
  const embedSrc = src
    .replace("youtu.be/", "www.youtube.com/embed/")
    .replace("youtube.com/watch?v=", "youtube.com/embed/");

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
            src={src}
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
