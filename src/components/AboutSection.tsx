import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-32 px-4 bg-surface-container-low border-t border-surface-container">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-4">We are waiting for you </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-8 tracking-tight">An <span className="italic text-primary">Exclusive</span> Experience</h2>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-10">
              {t("aboutDescription")}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-surface ghost-border p-6 rounded-md">
                <Clock className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-heading text-foreground mb-2 text-xl">{t("hours")}</h3>
                <p className="text-muted-foreground text-sm font-label whitespace-pre-line">{t("hoursDetail")}</p>
              </div>
              <div className="bg-surface ghost-border p-6 rounded-md">
                <Phone className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-heading text-foreground mb-2 text-xl">{t("contact")}</h3>
                <a href="tel:+201030355625" className="text-muted-foreground font-label text-sm hover:text-primary transition-colors">
                  01030355625
                </a>
                <div className="flex gap-4 mt-4">
                  <a href="https://www.instagram.com/kral.saloon/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="https://www.facebook.com/KRALSALON1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="bg-surface ghost-border p-8 rounded-md relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 <MapPin className="h-6 w-6 text-primary/30" />
               </div>
               <h3 className="font-heading text-foreground mb-4 text-2xl">{t("location")}</h3>
               <p className="text-muted-foreground font-label leading-relaxed mb-6">
                 Building 3, Al Naql w Handasa St<br />
                 Alexandria Governorate 21648
               </p>
               <div className="w-full h-64 rounded bg-surface border border-surface-container overflow-hidden">
                 <iframe
                    src="https://maps.google.com/maps?q=31.2167741,29.957407&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kral Salon location on Google Maps"
                    className="w-full grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                  />
               </div>
               <a
                  href="https://www.google.com/maps/search/?api=1&query=31.2167741,29.957407&query_place_id=ChIJOYNFEyDF9RQRoaQP1BFD9I4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-surface-container-high hover:bg-surface-bright text-foreground border border-surface-container px-6 py-4 rounded transition-all font-label tracking-wide"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  {t("openInGoogleMaps")}
                </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
