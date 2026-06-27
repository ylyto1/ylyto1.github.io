import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border border-border bg-card/80 px-1.5 py-1 shadow-soft backdrop-blur-md"
    >
      <Languages className="ms-1 size-4 text-violet" aria-hidden />
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`rounded-full px-3 py-1 text-xs font-bold transition ${
          lang === "fr" ? "bg-gradient-violet-sky text-white shadow-pop" : "text-foreground/70 hover:text-foreground"
        }`}
        aria-pressed={lang === "fr"}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`rounded-full px-3 py-1 text-sm font-bold transition ${
          lang === "ar" ? "bg-gradient-pink-sun text-white shadow-pop" : "text-foreground/70 hover:text-foreground"
        }`}
        aria-pressed={lang === "ar"}
      >
        العربية
      </button>
    </motion.div>
  );
}
