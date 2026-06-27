import { Instagram, Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LOGO = "https://cdn.ylyto.ma/ylyto/Logo%20YLYTO.png";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative mt-10 overflow-hidden bg-gradient-violet-sky text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 size-40 rounded-full bg-pink blur-3xl" />
        <div className="absolute bottom-10 right-10 size-40 rounded-full bg-sun blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-12 text-center">
        <img src={LOGO} alt="YLYTO" className="h-16 w-auto brightness-0 invert" loading="lazy" />
        <p className="max-w-md text-balance text-sm opacity-90">{t("footer.tagline")}</p>
        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25"
          >
            <Instagram className="size-5" />
          </a>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs opacity-80">
          <span>© {new Date().getFullYear()} YLYTO — {t("footer.rights")}</span>
          <Heart className="size-3.5 text-pink" />
        </div>
      </div>
    </footer>
  );
}
