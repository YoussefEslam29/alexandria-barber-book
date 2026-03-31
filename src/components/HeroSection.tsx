import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-barbershop.jpg";

interface HeroSectionProps {
  onBookClick: () => void;
}

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="Alexandria Cuts barbershop interior" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in">
        <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">Alexandria, Egypt</p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
          Karl <span className="text-primary">Salon</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl mx-auto">
          Premium grooming experience in Alexandria. Classic cuts, modern style.
        </p>
        <Button onClick={onBookClick} size="lg" className="text-base px-8 py-6">
          Book Your Appointment
        </Button>
      </div>
    </section>
  );
}
