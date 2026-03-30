import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/supabase-helpers";
import { Clock, Scissors } from "lucide-react";

export default function ServicesSection() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <p className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3">What We Offer</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-16">Our Services</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((service) => (
              <div key={service.id} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <Scissors className="h-5 w-5 text-primary" />
                  <span className="text-primary font-heading text-xl">{service.price} EGP</span>
                </div>
                <h3 className="font-heading text-lg text-foreground mb-1">{service.name}</h3>
                {service.name_ar && (
                  <p className="text-muted-foreground text-sm mb-2" dir="rtl">{service.name_ar}</p>
                )}
                <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{service.duration_minutes} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
