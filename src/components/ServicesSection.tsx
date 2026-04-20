import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/supabase-helpers";
import { Clock, Scissors } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ServicesSection() {
  const { lang, t } = useLanguage();
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  return (
    <section id="services" className="py-32 px-4 bg-surface">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-3">{t("whatWeOffer")}</p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">Our <span className="text-primary italic">Services</span></h2>
          </div>
          <div className="h-[1px] flex-grow bg-surface-container-high hidden md:block mx-8 mb-2"></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-container-low ghost-border rounded-md p-8 animate-pulse h-48 flex flex-col justify-between">
                <div className="flex justify-between w-full mb-4">
                  <div className="h-8 bg-surface-container-high rounded w-1/3"></div>
                  <div className="h-8 bg-surface-container-high rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-surface-container-high rounded w-full mb-2"></div>
                <div className="h-4 bg-surface-container-high rounded w-4/5 mb-6"></div>
                <div className="h-4 bg-surface-container-high rounded w-16 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services?.map((service) => (
              <div key={service.id} className="bg-surface-container-low ghost-border rounded-md p-8 hover:bg-surface-container-highest transition-all group flex flex-col justify-between items-start relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="flex items-start justify-between w-full mb-4">
                  <h3 className="font-heading text-2xl text-foreground">
                    {lang === "ar" && service.name_ar ? service.name_ar : service.name}
                  </h3>
                  <span className="text-primary font-heading text-2xl tracking-tight">{service.price} EGP</span>
                </div>
                {lang === "en" && service.name_ar && (
                  <p className="text-muted-foreground text-sm mb-4" dir="rtl">{service.name_ar}</p>
                )}
                <p className="text-muted-foreground font-body text-base mb-6 max-w-md">{service.description}</p>
                <div className="flex items-center gap-2 text-muted-foreground font-label text-xs uppercase tracking-widest mt-auto">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration_minutes} {t("min")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
