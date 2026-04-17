import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImg from "@/assets/hero-barbershop.jpg";

interface HeroSectionProps {
  onBookClick: () => void;
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0">
        <img 
          src={heroImg} 
          alt="Kral Salon barbershop interior" 
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in mt-16">
        <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-4">Alexandria's Premier Barbershop</p>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight tracking-tight">
          Kral <span className="italic text-primary">Salon</span>
        </h1>
        <p className="text-muted-foreground font-body text-lg md:text-xl mb-10 max-w-xl mx-auto font-light">
          {t("heroDescription")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={onBookClick} 
            size="lg" 
            className="text-primary-foreground font-label tracking-widest uppercase bg-primary-gradient hover:opacity-90 border-none rounded-md px-10 py-7 text-base shadow-[0_0_20px_rgba(0,219,231,0.2)] transition-all w-full sm:w-auto"
          >
            {t("bookAppointment")}
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="ghost-border text-foreground font-label tracking-widest uppercase hover:bg-surface-container-high transition-all rounded-md px-10 py-7 text-base w-full sm:w-auto"
          >
            <a href="#services">{t("exploreServices")}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
