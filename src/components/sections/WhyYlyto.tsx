import { motion } from "framer-motion";
import { Heart, Palette, Shirt, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function WhyYlyto() {
  const { t } = useI18n();
  const features = [
    { icon: Shirt, key: "f1", grad: "bg-gradient-pink-sun" },
    { icon: Palette, key: "f2", grad: "bg-gradient-violet-sky" },
    { icon: Heart, key: "f3", grad: "bg-gradient-pink-sun" },
    { icon: Sparkles, key: "f4", grad: "bg-gradient-violet-sky" },
  ] as const;

  return (
    <section id="why" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-sun/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet">
            {t("why.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl">
            <span className="text-gradient-brand">{t("why.title")}</span>
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, key, grad }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-3xl bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
            >
              <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-2xl ${grad} text-white shadow-pop`}>
                <Icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold">{t(`why.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{t(`why.${key}.body`)}</p>
              <div className="absolute -bottom-6 -right-6 size-20 rounded-full bg-gradient-violet-sky opacity-0 blur-2xl transition group-hover:opacity-30" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
