import { motion } from "framer-motion";
import { Heart, MapPin, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Story() {
  const { t } = useI18n();
  return (
    <section id="story" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="aspect-square w-full overflow-hidden rounded-[40%_60%_55%_45%/55%_45%_60%_40%] bg-gradient-pink-sun shadow-pop">
            <img
              src="https://cdn.ylyto.ma/ylyto/7.jpeg"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover mix-blend-multiply"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden size-32 rounded-3xl bg-sun shadow-soft sm:block" />
          <div className="absolute -top-6 -left-6 hidden size-20 rounded-full bg-sky shadow-soft sm:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-violet/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet">
            <Heart className="size-3.5" /> {t("story.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">
            <span className="text-gradient-brand">{t("story.title")}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-foreground/75">{t("story.body")}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Sparkles, key: "story.stat1", color: "bg-pink/15 text-pink" },
              { icon: MapPin, key: "story.stat2", color: "bg-sky/15 text-sky" },
              { icon: Heart, key: "story.stat3", color: "bg-sun/20 text-sun" },
            ].map(({ icon: Icon, key, color }) => (
              <li key={key} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className={`mb-2 inline-flex size-8 items-center justify-center rounded-full ${color}`}>
                  <Icon className="size-4" />
                </div>
                <p className="text-sm font-semibold leading-snug">{t(key)}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
