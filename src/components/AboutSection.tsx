import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <p className="text-primary text-sm tracking-[0.3em] uppercase text-center mb-3">{t("aboutUs")}</p>
        <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center mb-12">Kral Salon</h2>

        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16 text-lg">
          {t("aboutDescription")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">{t("location")}</h3>
            <a
              href="https://maps.app.goo.gl/SLAwcjqfJr5nXiFF6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              Building 3, Al Naql w Handsa St<br />Alexandria Governorate 21648
            </a>
          </div>
          <div className="text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">{t("hours")}</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{t("hoursDetail")}</p>
          </div>
          <div className="text-center">
            <Phone className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">{t("contact")}</h3>
            <a href="tel:+201030355625" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              01030355625
            </a>
          </div>
          <div className="text-center">
            <Instagram className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-foreground mb-2">{t("followUs")}</h3>
            <div className="flex flex-col gap-1">
              <a href="https://www.instagram.com/kral.saloon/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">Instagram</a>
              <a href="https://www.facebook.com/KRALSALON1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors">Facebook</a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          <div className="w-full rounded-lg overflow-hidden border border-border relative z-10 bg-card">
            <iframe
              src="https://maps.google.com/maps?q=31.2167741,29.957407&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kral Salon location on Google Maps"
              className="w-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
          </div>
          <div className="flex justify-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=31.2167741,29.957407&query_place_id=ChIJOYNFEyDF9RQRoaQP1BFD9I4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-8 py-3 rounded-full transition-all duration-300 font-medium tracking-wide hover:shadow-[0_0_15px] hover:shadow-primary/30 group"
            >
              <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {t("openInGoogleMaps")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
