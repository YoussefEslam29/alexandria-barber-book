import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import kralLogo from "@/assets/kral-logo.png";

interface NavbarProps {
  user: any;
  onSignOut: () => void;
  onAuthClick: () => void;
  onBookClick: () => void;
  onMyBookingsClick: () => void;
  onBarberClick?: () => void;
  isBarber?: boolean;
}

export default function Navbar({ onBookClick, isBarber }: NavbarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src={kralLogo} alt="Kral Salon logo" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-heading text-xl text-foreground">Kral Salon</span>
        </div>

        {/* Desktop — centered links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <a href="#services" className="text-muted-foreground hover:text-primary transition-colors text-sm font-label tracking-wide">{t("services")}</a>
          <a href="#barbers" className="text-muted-foreground hover:text-primary transition-colors text-sm font-label tracking-wide">{t("barbers")}</a>
          <a href="#masterpiece" className="text-muted-foreground hover:text-primary transition-colors text-sm font-label tracking-wide">{t("masterpiece")}</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-label tracking-wide">{t("about")}</a>
        </div>

        {/* Desktop — right side */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isBarber && (
            <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-primary transition-colors text-sm font-label">
              {t("adminDashboard")}
            </button>
          )}
          <Button
            onClick={onBookClick}
            size="sm"
            className="bg-primary-gradient text-primary-foreground font-label tracking-widest uppercase border-none shadow-[0_0_15px_rgba(0,219,231,0.15)] hover:opacity-90"
          >
            {t("bookNow")}
          </Button>
          <button onClick={toggleLang} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm" title="Switch language">
            <Globe className="h-4 w-4" />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLang} className="text-muted-foreground hover:text-primary transition-colors">
            <Globe className="h-5 w-5" />
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-surface-container-low border-b border-border px-4 py-5 space-y-4">
          <a href="#services" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary font-label text-sm tracking-wide">{t("services")}</a>
          <a href="#barbers" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary font-label text-sm tracking-wide">{t("barbers")}</a>
          <a href="#masterpiece" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary font-label text-sm tracking-wide">{t("masterpiece")}</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary font-label text-sm tracking-wide">{t("about")}</a>
          {isBarber && (
            <button onClick={() => { navigate("/admin"); setOpen(false); }} className="block text-muted-foreground hover:text-primary font-label text-sm w-full text-start">
              {t("adminDashboard")}
            </button>
          )}
          <Button
            onClick={() => { onBookClick(); setOpen(false); }}
            size="sm"
            className="w-full bg-primary-gradient text-primary-foreground font-label tracking-widest uppercase border-none"
          >
            {t("bookNow")}
          </Button>
        </div>
      )}
    </nav>
  );
}
