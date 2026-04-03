import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImage from "@/assets/hero-barbershop.jpg";

interface HeroSectionProps {
  onBookClick: () => void;
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Kral Salon barbershop interior" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">{t("heroSubtitle")}</p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
          Kral <span className="text-primary">Salon</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl mx-auto">
          {t("heroDescription")}
        </p>
        <Button onClick={onBookClick} size="lg" className="text-base px-8 py-6">
          {t("bookAppointment")}
        </Button>
      </div>
    </section>
  );
}
