import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { z } from "zod";
import { useI18n } from "@/lib/i18n";
import { leadsStore } from "@/lib/storage";

const WHATSAPP = "212600000000"; // replace via future config

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  city: z.string().trim().min(2).max(80),
});

export function LeadForm() {
  const { t, lang } = useI18n();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setStatus("err");
      return;
    }
    leadsStore.add(r.data);
    setStatus("ok");
    setForm({ name: "", phone: "", city: "" });
  };

  const waText =
    lang === "ar"
      ? "مرحباً يليتو، أرغب في طلب من المجموعة الجديدة."
      : "Bonjour YLYTO, je souhaite passer une commande de la nouvelle collection.";
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
          </div>

          <form onSubmit={onSubmit} className="relative mt-8 grid gap-4">
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
