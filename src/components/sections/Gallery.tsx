import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { productsStore, type ProductGroup } from "@/lib/storage";

export function Gallery() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<ProductGroup[]>([]);

  useEffect(() => {
    setItems(productsStore.list());
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <ProductCard product={p} currency={currency} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, currency }: { product: ProductGroup; currency: string }) {
  const [active, setActive] = useState(0);
  const images = product.images.length > 0 ? product.images : [""];
  const hasMany = images.length > 1;

  return (
    <figure
      className="group relative overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
      onMouseLeave={() => setActive(0)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {images.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              idx === active ? "opacity-100" : "opacity-0"
            } group-hover:scale-105`}
          />
        ))}

        {hasMany && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Image ${idx + 1}`}
                onMouseEnter={() => setActive(idx)}
                onFocus={() => setActive(idx)}
                onClick={() => setActive(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === active ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}

        {hasMany && (
          <span className="absolute top-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
            +{images.length - 1}
          </span>
        )}
      </div>

      <figcaption className="flex items-center justify-between gap-2 p-4">
        <span className="truncate text-sm font-semibold">{product.name}</span>
        <span className="shrink-0 rounded-full bg-gradient-violet-sky px-2.5 py-0.5 text-xs font-bold text-white">
          {product.price} {currency}
        </span>
      </figcaption>
    </figure>
  );
}
