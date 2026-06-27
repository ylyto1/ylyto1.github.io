import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

export function FloatingOrderButton() {
  const { t, lang } = useI18n();
  const items = useCart();
  const [visible, setVisible] = useState(false);
  const [hideAtForm, setHideAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      const order = document.getElementById("order");
      if (order) {
        const rect = order.getBoundingClientRect();
        setHideAtForm(rect.top < window.innerHeight * 0.6);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);

  if (!visible || hideAtForm) return null;

  return (
    <button
      type="button"
      onClick={() =>
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      className={`fixed bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-pink-sun px-5 py-3 text-sm font-bold text-white shadow-pop transition hover:scale-105 ${
        lang === "ar" ? "left-5" : "right-5"
      }`}
      aria-label={t("form.scroll_cta")}
    >
      <span className="relative">
        <ShoppingBag className="size-5" />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-white text-[10px] font-bold text-pink">
            {count}
          </span>
        )}
      </span>
      {t("form.scroll_cta")}
    </button>
  );
}
