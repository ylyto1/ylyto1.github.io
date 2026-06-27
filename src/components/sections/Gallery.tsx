import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { productsStore, type ProductGroup } from "@/lib/storage";
import { cartStore } from "@/lib/cart";
import { useIsMobile } from "@/hooks/use-mobile";

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

const SLIDE_MS = 1400;

function ProductCard({ product, currency }: { product: ProductGroup; currency: string }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isMobile = useIsMobile();
  const ref = useRef<HTMLElement>(null);
  const images = product.images.length > 0 ? product.images : [""];
  const hasMany = images.length > 1;

  useEffect(() => {
    if (!isMobile || !hasMany || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting && entry.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isMobile, hasMany]);

  useEffect(() => {
    if (!playing || !hasMany) return;
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % images.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [playing, hasMany, images.length]);

  const handleEnter = () => {
    if (isMobile) return;
    setPlaying(true);
  };
  const handleLeave = () => {
    if (isMobile) return;
    setPlaying(false);
    setActive(0);
  };

  const handleAdd = () => {
    cartStore.add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: images[0],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
    // smooth scroll to order section
    const el = document.getElementById("order");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <figure
      ref={ref}
      className="group relative overflow-hidden rounded-3xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-pop"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
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
              <span
                key={idx}
                aria-hidden
                className={`h-2 rounded-full transition-all ${
                  idx === active ? "w-6 bg-white" : "w-2 bg-white/60"
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
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <span className="mt-1 inline-block rounded-full bg-gradient-violet-sky px-2.5 py-0.5 text-xs font-bold text-white">
            {product.price} {currency}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          aria-label={t("gallery.add")}
          className={`grid size-11 shrink-0 place-items-center rounded-full text-white shadow-pop transition hover:scale-110 ${
            justAdded ? "bg-emerald-500" : "bg-gradient-pink-sun"
          }`}
        >
          {justAdded ? <Check className="size-5" /> : <Plus className="size-5" />}
        </button>
      </figcaption>
    </figure>
  );
}
