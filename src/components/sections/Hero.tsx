import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LOGO = "https://cdn.ylyto.ma/ylyto/Logo%20YLYTO.png";

export function Hero() {
  const { t, dir } = useI18n();
  return (
    <section className="relative isolate overflow-hidden bg-hero pt-28 pb-20 sm:pt-32 sm:pb-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.img
          src={LOGO}
          alt="YLYTO"
          width={220}
          height={220}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="mx-auto mb-6 h-28 w-auto drop-shadow-[0_8px_20px_rgba(239,128,178,0.45)] sm:h-36"
          initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 rounded-full border border-pink/30 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-wide text-violet shadow-soft backdrop-blur"
        >
          <Sparkles className="size-3.5 text-sun" />
          {t("hero.tag")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-6 text-balance text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient-brand">{t("hero.title")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base text-foreground/75 sm:text-lg"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#collection"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-pink-sun px-7 py-3.5 text-sm font-bold text-white shadow-pop transition hover:scale-[1.03] hover:shadow-[0_25px_55px_-15px_rgba(239,128,178,0.6)]"
          >
            {t("hero.cta")}
            <ArrowRight className={`size-4 transition group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </a>
          <a
            href="#order"
            className="inline-flex items-center gap-2 rounded-full border-2 border-violet/40 bg-white/70 px-7 py-3 text-sm font-bold text-violet backdrop-blur transition hover:bg-violet hover:text-white"
          >
            {t("hero.cta2")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
