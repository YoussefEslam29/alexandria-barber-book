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

export default function Navbar({ user, onSignOut, onAuthClick, onBookClick, onMyBookingsClick, onBarberClick, isBarber }: NavbarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <img src={kralLogo} alt="Kral Salon logo" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-heading text-xl text-foreground">Kral Salon</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("services")}</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("about")}</a>
          {user ? (
            <>
              <button onClick={onMyBookingsClick} className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("myBookings")}</button>
              {isBarber && onBarberClick && (
                <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-primary transition-colors text-sm">{t("adminDashboard")}</button>
              )}
              <Button onClick={onBookClick} size="sm">{t("bookNow")}</Button>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">{t("signOut")}</Button>
            </>
          ) : (
            <Button onClick={onAuthClick} size="sm">{t("signIn")}</Button>
          )}
          <button onClick={toggleLang} className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm" title="Switch language">
            <Globe className="h-4 w-4" />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleLang} className="text-muted-foreground hover:text-primary transition-colors text-sm">
            <Globe className="h-5 w-5" />
          </button>
          <button className="text-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary text-sm">{t("services")}</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary text-sm">{t("about")}</a>
          {user ? (
            <>
              <button onClick={() => { onMyBookingsClick(); setOpen(false); }} className="block text-muted-foreground hover:text-primary text-sm w-full text-start">{t("myBookings")}</button>
              {isBarber && onBarberClick && (
                <button onClick={() => { navigate("/admin"); setOpen(false); }} className="block text-muted-foreground hover:text-primary text-sm w-full text-start">{t("adminDashboard")}</button>
              )}
              <Button onClick={() => { onBookClick(); setOpen(false); }} size="sm" className="w-full">{t("bookNow")}</Button>
              <Button variant="ghost" size="sm" onClick={() => { onSignOut(); setOpen(false); }} className="w-full text-muted-foreground">{t("signOut")}</Button>
            </>
          ) : (
            <Button onClick={() => { onAuthClick(); setOpen(false); }} size="sm" className="w-full">{t("signIn")}</Button>
          )}
        </div>
      )}
    </nav>
  );
}
