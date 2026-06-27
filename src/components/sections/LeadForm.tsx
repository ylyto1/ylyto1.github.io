import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Minus, Plus, Trash2, Truck } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { leadsStore } from "@/lib/storage";
import { cartStore, useCart } from "@/lib/cart";

const WHATSAPP = "212600000000";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  city: z.string().trim().min(2).max(80),
});

export function LeadForm() {
  const { t, lang } = useI18n();
  const items = useCart();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  const currency = lang === "ar" ? "د.م." : "MAD";
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success || items.length === 0) {
      setStatus("err");
      return;
    }
    leadsStore.add({
      ...r.data,
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      total,
    });
    setStatus("ok");
    setForm({ name: "", phone: "", city: "" });
    cartStore.clear();
  };

  const waText =
    (lang === "ar"
      ? "مرحباً يليتو، أرغب في طلب:\n"
      : "Bonjour YLYTO, je souhaite commander :\n") +
    items.map((i) => `• ${i.name} × ${i.qty}`).join("\n") +
    (items.length ? `\n${t("form.total")}: ${total} ${currency}` : "");
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waText)}`;

  return (
    <section id="order" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[36px] bg-card p-8 shadow-pop sm:p-12"
        >
          <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-pink/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-60 rounded-full bg-sky/30 blur-3xl" />

          <div className="relative text-center">
            <span className="inline-flex rounded-full bg-pink/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink">
              {t("form.eyebrow")}
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl">
              <span className="text-gradient-brand">{t("form.title")}</span>
            </h2>
            <p className="mt-2 text-foreground/70">{t("form.subtitle")}</p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-700">
              <Truck className="size-4" />
              {t("form.free_shipping")}
            </div>
          </div>

          {/* Cart */}
          <div className="relative mt-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground/70">
              {t("form.products")}
            </h3>
            {items.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-border bg-background/60 px-4 py-6 text-center text-sm text-foreground/60">
                {t("form.empty")}
              </p>
            ) : (
              <div className="overflow-hidden rounded-2xl border-2 border-border bg-background">
                <ul className="divide-y divide-border">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center gap-3 p-3">
                      {i.image && (
                        <img
                          src={i.image}
                          alt=""
                          className="size-14 shrink-0 rounded-xl object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{i.name}</p>
                        <p className="text-xs text-foreground/60">
                          {i.price} {currency}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
                        <button
                          type="button"
                          aria-label="-"
                          onClick={() => cartStore.setQty(i.id, i.qty - 1)}
                          className="grid size-7 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button
                          type="button"
                          aria-label="+"
                          onClick={() => cartStore.setQty(i.id, i.qty + 1)}
                          className="grid size-7 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label="remove"
                        onClick={() => cartStore.remove(i.id)}
                        className="grid size-8 place-items-center rounded-full text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between bg-secondary/60 px-4 py-3">
                  <span className="text-sm font-bold">{t("form.total")}</span>
                  <span className="rounded-full bg-gradient-violet-sky px-3 py-1 text-sm font-bold text-white">
                    {total} {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="relative mt-6 grid gap-4">
            <Field label={t("form.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field
              label={t("form.phone")}
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field label={t("form.city")} value={form.city} onChange={(v) => setForm({ ...form, city: v })} />

            {status === "err" && (
              <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                {t("form.error")}
              </p>
            )}
            {status === "ok" && (
              <p className="rounded-xl bg-sky/15 px-4 py-2 text-sm font-medium text-sky">{t("form.success")}</p>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-pink-sun px-6 py-3.5 text-sm font-bold text-white shadow-pop transition hover:scale-[1.02]"
              >
                <Send className="size-4" />
                {t("form.submit")}
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-bold text-white shadow-soft transition hover:scale-[1.02]"
              >
                <MessageCircle className="size-4" />
                {t("form.whatsapp")}
              </a>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground/80">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-base outline-none transition focus:border-pink focus:ring-4 focus:ring-pink/15"
        required
      />
    </label>
  );
}
