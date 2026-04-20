import { Crown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface PremiumServiceSectionProps {
  onBookPremium?: () => void;
}

export default function PremiumServiceSection({ onBookPremium }: PremiumServiceSectionProps) {
  const { lang, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 px-4 bg-surface overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className={`flex flex-col md:flex-row justify-between items-end mb-10 gap-4 ${lang === "ar" ? "md:flex-row-reverse" : ""}`}>
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <p className="text-[#D4AF37] font-label text-sm tracking-[0.3em] uppercase mb-2">{t("premiumService")}</p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground tracking-tight">
              {lang === "ar" ? (
                <>الحلاقة في <span className="text-[#D4AF37] italic">المنزل</span></>
              ) : (
                <>Grooming at <span className="text-[#D4AF37] italic">Home</span></>
              )}
            </h2>
          </div>
          <div className="h-[1px] flex-grow bg-surface-container-high hidden md:block mx-8 mb-2"></div>
        </div>

        <div className="flex flex-col gap-8 items-stretch w-full">
          <div 
            className="flex-1 bg-surface-container-low border border-surface-container-highest p-6 md:p-12 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:border-[#D4AF37] group relative overflow-hidden flex flex-col items-start justify-center rounded-md min-h-[350px] md:min-h-[400px] w-full"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            <div className={`absolute top-0 ${lang === "ar" ? "right-0" : "left-0"} w-1 h-full bg-[#D4AF37] transition-colors duration-500`}></div>
            
            <Crown className="w-10 h-10 md:w-12 md:h-12 text-[#D4AF37] mb-6 transition-colors duration-500" />
            
            <h3 className="font-heading text-2xl md:text-4xl text-foreground mb-4 leading-tight">
              The Mobile Sanctuary
            </h3>
            
            <p className="text-muted-foreground font-body text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
              Experience the pinnacle of grooming without leaving your domain. Kral Salon brings the exclusive barbering experience directly to your door.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-10">
              <div className="bg-surface/50 p-6 rounded border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                <span className="text-[#D4AF37] font-heading text-xl mb-2 block">I. Secure the Slot</span>
                <p className="text-sm text-muted-foreground">Select your preferred time and barber. Let us know your location in Alexandria.</p>
              </div>
              <div className="bg-surface/50 p-6 rounded border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                <span className="text-[#D4AF37] font-heading text-xl mb-2 block">II. The Arrival</span>
                <p className="text-sm text-muted-foreground">Our master barber arrives with our premium mobile setup, respecting your privacy.</p>
              </div>
              <div className="bg-surface/50 p-6 rounded border border-white/5 hover:border-[#D4AF37]/50 transition-colors">
                <span className="text-[#D4AF37] font-heading text-xl mb-2 block">III. The Transformation</span>
                <p className="text-sm text-muted-foreground">Enjoy a flawless cut, hot towel shave, and grooming in your own sanctuary.</p>
              </div>
            </div>
            
            {onBookPremium && (
              <button 
                onClick={onBookPremium}
                className="px-6 py-3 md:px-8 md:py-3 bg-surface border border-[#D4AF37] text-[#D4AF37] font-label uppercase tracking-widest transition-all hover:bg-[#D4AF37]/10 rounded-sm text-sm md:text-base whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                Book Home Service
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
