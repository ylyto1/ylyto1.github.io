import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { pricesStore, type ProductPrice } from "@/lib/storage";

export function Gallery() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<ProductPrice[]>([]);

  useEffect(() => {
    setItems(pricesStore.list());
  }, []);

  const currency = lang === "ar" ? "د.م." : "MAD";

  return (
    <section id="collection" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-pink/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink">
            {t("gallery.eyebrow")}
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl">
            <span className="text-gradient-brand">{t("gallery.title")}</span>
          </h2>
          <p className="mt-3 text-foreground/70">{t("gallery.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <motion.figure
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
              className="group relative overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
            >
              <div className="aspect-[4/5] overflow-hidden bg-secondary">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 p-3.5">
                <span className="truncate text-sm font-semibold">{p.name}</span>
                <span className="shrink-0 rounded-full bg-gradient-violet-sky px-2.5 py-0.5 text-xs font-bold text-white">
                  {p.price} {currency}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
