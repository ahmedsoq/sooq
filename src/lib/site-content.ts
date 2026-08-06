import { egyptAreas, governorateNames } from "./egypt-areas";

export type SiteImage = { src: string; caption: string };
export type SpecItem = { title: string; desc: string };

export type SiteContent = {
  brand: string;
  brandTag: string;
  announce: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  oldPrice: number;
  price: number;
  shippingFee: number;
  shippingText: string;
  priceNote: string;
  ctaText: string;
  stockText: string;
  images: SiteImage[];
  imageFit: "cover" | "contain";
  imageRatio: "square" | "video" | "portrait";
  videoTitle: string;
  videoSrc: string;
  videoPoster: string;
  videoRatio: "square" | "video" | "portrait";
  videoFit: "cover" | "contain";
  countdownTitle: string;
  countdownHours: number;
  liveOrders: boolean;
  specsTitle: string;
  specs: SpecItem[];
  contactTitle: string;
  contactSubtitle: string;
  whatsapp: string;
  phone: string;
  facebook: string;
  formTitle: string;
  successTitle: string;
  successMsg: string;
  footer: string;
  telegramToken: string;
  telegramChatId: string;
};

export const defaultContent: SiteContent = {
  brand: "elsoooq",
  brandTag: "الدفع عند الاستلام · شحن مجاني",
  announce: "🔥 عرض محدود · آخر كمية بسعر التخفيض · الشحن مجاناً لكل محافظات مصر",
  heroBadge: "الأكثر طلباً هذا الأسبوع",
  heroTitle: "كاميرا مراقبة جيب لاسلكية",
  heroSubtitle:
    "صغيرة تدخل جيبك، تصوّر صوت وصورة بجودة عالية، وتتابعها لحظة بلحظة من موبايلك على التطبيق من أي مكان.",
  oldPrice: 1960,
  price: 1200,
  shippingFee: 0,
  shippingText: "شحن مجاني لكل المحافظات",
  priceNote: "وفّر 760 ج.م اليوم فقط",
  ctaText: "اطلب الآن · الدفع عند الاستلام",
  stockText: "متبقي كمية محدودة جداً",
  images: [
    {
      src: "/api/public/media/1786030112196-7vpksc-6028298805863714315.jpg",
      caption: "حجم صغير جداً يدخل في كف اليد",
    },
    {
      src: "/api/public/media/1786030116515-yk09mk-6028298805863714310.jpg",
      caption: "تثبيت مغناطيسي في أي مكان",
    },
    {
      src: "/api/public/media/1786030123632-qgr94t-6028298805863714311.jpg",
      caption: "مشاهدة مباشرة من موبايلك",
    },
    {
      src: "/api/public/media/1786030141060-lwhtoy-6028298805863714309.jpg",
      caption: "الكرتونة كاملة بكل الملحقات",
    },
  ],
  imageFit: "cover",
  imageRatio: "square",
  videoTitle: "شاهد الكاميرا وهي تعمل",
  videoSrc: "https://youtube.com/shorts/Rahad6F_gNQ?feature=share",
  videoPoster: "",
  videoRatio: "portrait",
  videoFit: "contain",
  countdownTitle: "العرض ينتهي خلال",
  countdownHours: 5,
  liveOrders: true,
  specsTitle: "المواصفات",
  specs: [
    { title: "جودة تصوير HD", desc: "فيديو واضح 1080P مع تسجيل الصوت والصورة معاً." },
    { title: "رؤية ليلية", desc: "تصوير واضح في الظلام الدامس بدون أي إضاءة." },
    {
      title: "واي فاي ومتابعة من الموبايل",
      desc: "بث مباشر على التطبيق من التليفون و تخزين التصوير علي التليفون.",
    },
    {
      title: "تدعم التخزين علي ميموري",
      desc: "تخزين صوت و صورة علي كارت ميموري بدون انترنت او تطبيقات.",
    },
    {
      title: "بطارية داخلية",
      desc: "تعمل بدون كهرباء وتشحن بكابل USB بسهولة وتصل الي 4 ساعات ونص تصوير مستمر.",
    },
    { title: "حجم صغير", desc: "يمكن وضعها في ايه مكان مخفي بكل سهوله." },
  ],
  contactTitle: "تواصل معنا",
  contactSubtitle: "فريقنا جاهز للرد على أي استفسار قبل الطلب",
  whatsapp: "+201022077100",
  phone: "01022077100",
  facebook: "https://facebook.com/elsoooqshop",
  formTitle: "أكمل بياناتك وهنتصل بك للتأكيد",
  successTitle: "تم تنفيذ طلبك بنجاح 🎉",
  successMsg: "سوف نتصل بك للتأكيد في أقرب وقت.",
  footer: "elsoooq · جميع الحقوق محفوظة",
  telegramToken: "8635691866:AAFKvoeVvob5czKeNvwP_yG3cPeUE8QEQp8",
  telegramChatId: "8260431304",
};

export const governorates = governorateNames;
export { egyptAreas };
