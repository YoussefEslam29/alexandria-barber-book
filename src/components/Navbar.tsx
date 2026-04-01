import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl text-foreground">Karl Salon</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="text-muted-foreground hover:text-primary transition-colors text-sm">Services</a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About</a>
          {user ? (
            <>
              <button onClick={onMyBookingsClick} className="text-muted-foreground hover:text-primary transition-colors text-sm">My Bookings</button>
              {isBarber && onBarberClick && (
                <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-primary transition-colors text-sm">Admin Dashboard</button>
              )}
              <Button onClick={onBookClick} size="sm">Book Now</Button>
              <Button variant="ghost" size="sm" onClick={onSignOut} className="text-muted-foreground">Sign Out</Button>
            </>
          ) : (
            <Button onClick={onAuthClick} size="sm">Sign In</Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary text-sm">Services</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-primary text-sm">About</a>
          {user ? (
            <>
              <button onClick={() => { onMyBookingsClick(); setOpen(false); }} className="block text-muted-foreground hover:text-primary text-sm w-full text-left">My Bookings</button>
              {isBarber && onBarberClick && (
                <button onClick={() => { navigate("/admin"); setOpen(false); }} className="block text-muted-foreground hover:text-primary text-sm w-full text-left">Admin Dashboard</button>
              )}
              <Button onClick={() => { onBookClick(); setOpen(false); }} size="sm" className="w-full">Book Now</Button>
              <Button variant="ghost" size="sm" onClick={() => { onSignOut(); setOpen(false); }} className="w-full text-muted-foreground">Sign Out</Button>
            </>
          ) : (
            <Button onClick={() => { onAuthClick(); setOpen(false); }} size="sm" className="w-full">Sign In</Button>
          )}
        </div>
      )}
    </nav>
  );
}
