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

        <div className="mt-16 rounded-lg overflow-hidden border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3412.123!2d29.9194!3d31.2156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c4f16bfb5f67%3A0x7e3c1e5b0a1b2c3d!2sKral%20Salon!5e0!3m2!1sen!2seg!4v1700000000000"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kral Salon location on Google Maps"
          />
        </div>
      </div>
    </section>
  );
}
