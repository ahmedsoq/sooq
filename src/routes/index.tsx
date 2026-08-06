import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Flame,
  MessageCircle,
  Pencil,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { OrderDialog } from "@/components/OrderDialog";
import { EditPanel } from "@/components/EditPanel";
import { useContent } from "@/lib/use-content";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "elsoooq | كاميرا مراقبة جيب لاسلكية بسعر العرض" },
      {
        name: "description",
        content:
          "كاميرا مراقبة صغيرة لاسلكية تصوّر صوت وصورة وتتابعها من موبايلك. عرض محدود 1200 ج.م بدل 1960 مع شحن مجاني والدفع عند الاستلام.",
      },
      { property: "og:title", content: "elsoooq | كاميرا مراقبة جيب لاسلكية" },
      {
        property: "og:description",
        content: "عرض محدود: 1200 ج.م بدل 1960 · شحن مجاني · الدفع عند الاستلام لكل محافظات مصر.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  const { content, update, reset, hydrated } = useContent();
  const [active, setActive] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("edit=1"))
      setEditOpen(true);
  }, []);

  useEffect(() => {
    if (orderOpen) return;
    const t = setInterval(() => setActive((i) => (i + 1) % content.images.length), 3500);
    return () => clearInterval(t);
  }, [content.images.length, orderOpen]);

  const discount = Math.max(
    0,
    Math.round(((content.oldPrice - content.price) / (content.oldPrice || 1)) * 100),
  );

  return (
    <div dir="rtl" className="min-h-screen pb-28">
      {/* شريط العرض */}
      <div className="overflow-hidden border-b border-border bg-accent/15 py-2">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-sm font-semibold">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="text-accent-foreground/90">
              {content.announce}
            </span>
          ))}
        </div>
      </div>

      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight gold-text">{content.brand}</h2>
          <p className="text-xs text-muted-foreground">{content.brandTag}</p>
        </div>
        <button
          onClick={() => setEditOpen(true)}
          className="glass rounded-xl p-2 text-muted-foreground"
          aria-label="تعديل الموقع"
        >
          <Pencil className="size-4" />
        </button>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4">
        {/* كرت الصور */}
        <section className="glass overflow-hidden rounded-3xl p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
              <Flame className="size-3.5" /> {content.heroBadge}
            </span>
            <span className="rounded-full gold-fill px-3 py-1 text-xs font-black">
              خصم {discount}%
            </span>
          </div>

          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-secondary">
            {content.images.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.caption}
                width={1024}
                height={1024}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 size-full object-cover transition-all duration-700 ${
                  i === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
              <p className="text-sm font-semibold">{content.images[active]?.caption}</p>
            </div>
            <button
              onClick={() => setActive((i) => (i + 1) % content.images.length)}
              aria-label="التالي"
              className="glass absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() =>
                setActive((i) => (i - 1 + content.images.length) % content.images.length)
              }
              aria-label="السابق"
              className="glass absolute top-1/2 left-2 -translate-y-1/2 rounded-full p-2"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {content.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border-2 transition ${
                  i === active ? "border-primary" : "border-transparent opacity-60"
                }`}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  loading="lazy"
                  className="aspect-square size-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* السعر */}
          <div className="mt-4 rounded-2xl bg-secondary/50 p-4 text-center">
            <h1 className="text-xl font-black sm:text-2xl">{content.heroTitle}</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              {content.heroSubtitle}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-lg text-muted-foreground line-through">
                {content.oldPrice} ج.م
              </span>
              <span className="text-4xl font-black gold-text">{content.price} ج.م</span>
            </div>
            <p className="mt-1 text-sm font-bold text-success">{content.priceNote}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
              <Chip icon={<Truck className="size-3.5" />} text={content.shippingText} />
              <Chip icon={<Wallet className="size-3.5" />} text="الدفع عند الاستلام" />
              <Chip icon={<ShieldCheck className="size-3.5" />} text="ضمان الاستبدال" />
            </div>
            <p className="mt-3 animate-pulse text-xs font-bold text-accent">{content.stockText}</p>
            <button
              onClick={() => setOrderOpen(true)}
              className="cta-pulse mt-4 w-full rounded-2xl gold-fill px-4 py-4 text-lg font-black"
            >
              {content.ctaText}
            </button>
          </div>
        </section>

        {/* كرت المواصفات */}
        <section className="glass rounded-3xl p-5">
          <h2 className="mb-4 text-xl font-black gold-text">{content.specsTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.specs.map((s, i) => (
              <div key={i} className="rounded-2xl bg-secondary/50 p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-5 text-primary" />
                  <h3 className="font-bold">{s.title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* كرت التواصل */}
        <section className="glass rounded-3xl p-5 text-center">
          <h2 className="text-xl font-black gold-text">{content.contactTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{content.contactSubtitle}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a
              href={`https://wa.me/2${content.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-whatsapp transition hover:scale-[1.02]"
            >
              <MessageCircle className="size-5" /> واتساب
            </a>
            <a
              href={content.facebook}
              target="_blank"
              rel="noreferrer"
              className="glass flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-telegram transition hover:scale-[1.02]"
            >
              <Facebook className="size-5" /> فيسبوك
            </a>
            <a
              href={`tel:${content.phone}`}
              className="glass flex items-center justify-center gap-2 rounded-2xl px-4 py-4 font-bold text-primary transition hover:scale-[1.02]"
            >
              <Phone className="size-5" /> اتصال
            </a>
          </div>
        </section>

        <footer className="py-6 text-center text-xs text-muted-foreground">{content.footer}</footer>
      </main>

      {/* زر ثابت أسفل الشاشة */}
      <div className="glass fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 p-3">
        <div className="shrink-0 text-center">
          <p className="text-xs text-muted-foreground line-through">{content.oldPrice}</p>
          <p className="text-lg font-black gold-text">{content.price} ج.م</p>
        </div>
        <button
          onClick={() => setOrderOpen(true)}
          className="flex-1 rounded-2xl gold-fill px-4 py-3.5 font-black"
        >
          {content.ctaText}
        </button>
      </div>

      {hydrated && orderOpen && (
        <OrderDialog content={content} onClose={() => setOrderOpen(false)} />
      )}
      {editOpen && (
        <EditPanel
          content={content}
          update={update}
          reset={reset}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-muted-foreground">
      {icon} {text}
    </span>
  );
}
