import { createFileRoute } from "@tanstack/react-router";
import { BackgroundDecor } from "@/components/BackgroundDecor";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FloatingOrderButton } from "@/components/FloatingOrderButton";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Gallery } from "@/components/sections/Gallery";
import { WhyYlyto } from "@/components/sections/WhyYlyto";
import { LeadForm } from "@/components/sections/LeadForm";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YLYTO — Mode enfant marocaine premium" },
      {
        name: "description",
        content:
          "Nouvelle marque marocaine de vêtements pour enfants. Douceur, couleurs joyeuses et confort. Commandez la nouvelle collection.",
      },
      { property: "og:title", content: "YLYTO — Mode enfant marocaine premium" },
      {
        property: "og:description",
        content: "Découvrez la nouvelle collection YLYTO, pensée au Maroc avec amour.",
      },
      { property: "og:image", content: "https://cdn.ylyto.ma/ylyto/1.webp" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundDecor />
      <LanguageSwitcher />
      <FloatingOrderButton />
      <main>
        <Hero />
        <Story />
        <Gallery />
        <WhyYlyto />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}
