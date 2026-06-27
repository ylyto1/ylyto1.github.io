import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "ar";

type Dict = Record<string, string>;
const dictionaries: Record<Lang, Dict> = {
  fr: {
    "nav.story": "Notre histoire",
    "nav.collection": "Collection",
    "nav.why": "Pourquoi YLYTO",
    "nav.contact": "Commander",
    "hero.tag": "Nouvelle marque marocaine pour enfants",
    "hero.title": "Des tenues qui font sourire les petits cœurs",
    "hero.subtitle":
      "YLYTO habille vos enfants de douceur, de couleurs joyeuses et de matières pensées pour leur confort. Une mode tendre, made in Morocco.",
    "hero.cta": "Découvrir la collection",
    "hero.cta2": "Commander sur WhatsApp",
    "story.eyebrow": "Notre histoire",
    "story.title": "Née d'un câlin, pensée pour grandir",
    "story.body":
      "YLYTO est une marque marocaine créée par des mamans, pour les mamans. Chaque pièce est imaginée pour accompagner les premiers pas, les fous rires et les siestes câlines. Coupes confortables, tissus respirants et palette joyeuse — pour que chaque journée soit une fête.",
    "story.stat1": "Coton doux et certifié",
    "story.stat2": "Fait au Maroc avec amour",
    "story.stat3": "Petites séries, grand soin",
    "gallery.eyebrow": "Collection",
    "gallery.title": "La nouvelle collection YLYTO",
    "gallery.subtitle": "Une parade de couleurs tendres et de matières adorables.",
    "why.eyebrow": "Pourquoi YLYTO",
    "why.title": "Le réflexe douceur des mamans modernes",
    "why.f1.title": "Matières premium",
    "why.f1.body": "Cotons doux et tissus respirants choisis pour la peau délicate de bébé.",
    "why.f2.title": "Design joyeux",
    "why.f2.body": "Des motifs originaux et des couleurs vives pour des enfants rayonnants.",
    "why.f3.title": "Confort absolu",
    "why.f3.body": "Coupes pensées pour bouger, sauter et grandir sans contrainte.",
    "why.f4.title": "Fait au Maroc",
    "why.f4.body": "Une production locale, éthique et faite avec beaucoup d'amour.",
    "gallery.add": "Ajouter",
    "gallery.added": "Ajouté ✓",
    "form.eyebrow": "Commander",
    "form.title": "Laissez-nous vos coordonnées",
    "form.subtitle": "Une de nos conseillères vous rappelle pour finaliser votre commande.",
    "form.name": "Nom complet",
    "form.phone": "Téléphone",
    "form.city": "Ville",
    "form.submit": "Envoyer ma demande",
    "form.whatsapp": "Commander sur WhatsApp",
    "form.success": "Merci ! Nous vous contactons très vite 💖",
    "form.error": "Merci de remplir tous les champs et choisir au moins un produit.",
    "form.products": "Mes produits",
    "form.empty": "Aucun produit choisi. Cliquez sur ➕ dans la collection.",
    "form.qty": "Qté",
    "form.total": "Total",
    "form.free_shipping": "🚚 Livraison gratuite partout au Maroc",
    "form.scroll_cta": "Commander maintenant",
    "footer.tagline": "La douceur a une nouvelle marque.",
    "footer.rights": "Tous droits réservés.",
  },
  ar: {
    "nav.story": "قصتنا",
    "nav.collection": "المجموعة",
    "nav.why": "لماذا يليتو",
    "nav.contact": "اطلب الآن",
    "hero.tag": "ماركة مغربية جديدة لملابس الأطفال",
    "hero.title": "إطلالات تُسعد قلوب الصغار",
    "hero.subtitle":
      "يليتو يلبس أطفالك بالنعومة والألوان البهيجة وأقمشة مختارة لراحتهم. موضة لطيفة، صُنعت بالمغرب.",
    "hero.cta": "اكتشف المجموعة",
    "hero.cta2": "اطلب عبر واتساب",
    "story.eyebrow": "قصتنا",
    "story.title": "وُلدت من حضنٍ، وصُممت لتكبر",
    "story.body":
      "يليتو ماركة مغربية من أمهات إلى أمهات. كل قطعة مصممة لترافق أولى الخطوات، الضحكات والقيلولة. قصّات مريحة، أقمشة تتنفس، وألوان فرحة لتجعل كل يوم احتفالاً.",
    "story.stat1": "قطن ناعم ومعتمد",
    "story.stat2": "صُنع بالمغرب بكل حب",
    "story.stat3": "كميات محدودة وعناية كبيرة",
    "gallery.eyebrow": "المجموعة",
    "gallery.title": "مجموعة يليتو الجديدة",
    "gallery.subtitle": "موكب من الألوان الناعمة والأقمشة الرائعة.",
    "why.eyebrow": "لماذا يليتو",
    "why.title": "الاختيار المُفضل للأمهات العصريات",
    "why.f1.title": "أقمشة فاخرة",
    "why.f1.body": "قطن ناعم وأقمشة تتنفس مختارة لبشرة الأطفال الحساسة.",
    "why.f2.title": "تصاميم مرحة",
    "why.f2.body": "نقوش أصلية وألوان زاهية لأطفال مشرقين.",
    "why.f3.title": "راحة مطلقة",
    "why.f3.body": "قصّات مصممة للحركة، القفز والنمو بحرية.",
    "why.f4.title": "صُنع بالمغرب",
    "why.f4.body": "إنتاج محلي وأخلاقي مصنوع بكل حب.",
    "gallery.add": "أضف",
    "gallery.added": "تمت الإضافة ✓",
    "form.eyebrow": "اطلب الآن",
    "form.title": "اترك لنا معلوماتك",
    "form.subtitle": "ستتصل بك إحدى مستشاراتنا لإتمام طلبك.",
    "form.name": "الاسم الكامل",
    "form.phone": "رقم الهاتف",
    "form.city": "المدينة",
    "form.submit": "إرسال الطلب",
    "form.whatsapp": "اطلب عبر واتساب",
    "form.success": "شكراً لك! سنتواصل معك قريباً 💖",
    "form.error": "يرجى ملء جميع الحقول واختيار منتج واحد على الأقل.",
    "form.products": "منتجاتي",
    "form.empty": "لم تختر أي منتج بعد. اضغط على ➕ في المجموعة.",
    "form.qty": "الكمية",
    "form.total": "المجموع",
    "form.free_shipping": "🚚 توصيل مجاني لجميع أنحاء المغرب",
    "form.scroll_cta": "اطلب الآن",
    "footer.tagline": "النعومة لها ماركة جديدة.",
    "footer.rights": "جميع الحقوق محفوظة.",
  },
};

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; dir: "ltr" | "rtl" };
const Ctx = createContext<I18nCtx | null>(null);
const STORAGE_KEY = "ylyto.lang";

function detect(): Lang {
  if (typeof window === "undefined") return "fr";
  const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === "fr" || saved === "ar") return saved;
  const nav = window.navigator.language.toLowerCase();
  return nav.startsWith("ar") ? "ar" : "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const l = detect();
    setLangState(l);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<I18nCtx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
      },
      t: (k) => dictionaries[lang][k] ?? k,
      dir: lang === "ar" ? "rtl" : "ltr",
    }),
    [lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}
