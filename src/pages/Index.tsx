import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/lib/supabase-helpers";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import BookingModal from "@/components/BookingModal";
import MyBookings from "@/components/MyBookings";
import BarberDashboard from "@/components/BarberDashboard";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Index() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [barberOpen, setBarberOpen] = useState(false);
  const [isBarber, setIsBarber] = useState(false);

  useEffect(() => {
    if (user) {
      getProfile(user.id).then((p) => setIsBarber(p?.is_barber ?? false)).catch(() => {});
    } else {
      setIsBarber(false);
    }
  }, [user]);

  const handleBookClick = () => {
    if (!user) {
      setAuthOpen(true);
    } else {
      setBookOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={user}
        onSignOut={signOut}
        onAuthClick={() => setAuthOpen(true)}
        onBookClick={handleBookClick}
        onMyBookingsClick={() => setMyBookingsOpen(true)}
        onBarberClick={() => setBarberOpen(true)}
        isBarber={isBarber}
      />
      <HeroSection onBookClick={handleBookClick} />
      <ServicesSection />
      <AboutSection />
      <Footer />

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={signIn} onSignUp={signUp} />
      {user && (
        <>
          <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} userId={user.id} />
          <MyBookings open={myBookingsOpen} onClose={() => setMyBookingsOpen(false)} userId={user.id} />
          {isBarber && <BarberDashboard open={barberOpen} onClose={() => setBarberOpen(false)} />}
        </>
      )}
    </div>
  );
}
