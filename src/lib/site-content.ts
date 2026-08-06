import cam1 from "@/assets/cam-1.jpg";
import cam2 from "@/assets/cam-2.jpg";
import cam3 from "@/assets/cam-3.jpg";
import cam4 from "@/assets/cam-4.jpg";

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
    { src: cam1, caption: "حجم صغير جداً يدخل في كف اليد" },
    { src: cam2, caption: "تثبيت مغناطيسي في أي مكان" },
    { src: cam3, caption: "مشاهدة مباشرة من موبايلك" },
    { src: cam4, caption: "الكرتونة كاملة بكل الملحقات" },
  ],
  imageFit: "cover",
  imageRatio: "square",
  videoTitle: "شاهد الكاميرا وهي تعمل",
  videoSrc: "",
  videoPoster: "",
  videoRatio: "video",
  videoFit: "contain",
  countdownTitle: "العرض ينتهي خلال",
  countdownHours: 5,
  liveOrders: true,
  specsTitle: "المواصفات",
  specs: [
    { title: "جودة تصوير HD", desc: "فيديو واضح 1080P مع تسجيل الصوت والصورة معاً." },
    { title: "رؤية ليلية", desc: "تصوير واضح في الظلام الدامس بدون أي إضاءة." },
    { title: "واي فاي ومتابعة من الموبايل", desc: "بث مباشر على التطبيق من أي مكان في العالم." },
    { title: "حساس حركة", desc: "يبدأ التسجيل ويرسل تنبيه فور اكتشاف أي حركة." },
    { title: "بطارية داخلية", desc: "تعمل بدون كهرباء وتشحن بكابل USB بسهولة." },
    { title: "تثبيت مغناطيسي", desc: "تثبتها في أي مكان في ثانية بدون مسامير." },
  ],
  contactTitle: "تواصل معنا",
  contactSubtitle: "فريقنا جاهز للرد على أي استفسار قبل الطلب",
  whatsapp: "01000000000",
  phone: "01000000000",
  facebook: "https://facebook.com",
  formTitle: "أكمل بياناتك وهنتصل بك للتأكيد",
  successTitle: "تم تنفيذ طلبك بنجاح 🎉",
  successMsg: "سوف نتصل بك للتأكيد في أقرب وقت.",
  footer: "elsoooq · جميع الحقوق محفوظة",
};

export const governorates = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الدقهلية",
  "الشرقية",
  "الغربية",
  "المنوفية",
  "كفر الشيخ",
  "البحيرة",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
];
