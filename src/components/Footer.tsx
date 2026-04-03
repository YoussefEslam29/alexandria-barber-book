import { useLanguage } from "@/i18n/LanguageContext";
import kralLogo from "@/assets/kral-logo.png";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={kralLogo} alt="Kral Salon logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-heading text-lg text-foreground">Kral Salon</span>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <a href="https://www.instagram.com/kral.saloon/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Instagram</a>
          <a href="https://www.facebook.com/KRALSALON1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-sm">Facebook</a>
          <a href="tel:+201030355625" className="text-muted-foreground hover:text-primary transition-colors text-sm">01030355625</a>
        </div>
        <p className="text-muted-foreground text-sm">
          {t("footerText")} © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
