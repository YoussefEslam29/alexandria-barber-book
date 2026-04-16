import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import BarbersSection from "@/components/BarbersSection";
import MasterpieceSection from "@/components/MasterpieceSection";

export default function Index() {
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(undefined);

  const handleBookClick = (barberName?: string) => {
    setSelectedBarber(barberName);
    setBookOpen(true);
  };

  const handleBookWithBarber = (barberName: string) => {
    handleBookClick(barberName);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        user={null}
        onSignOut={() => {}}
        onAuthClick={() => {}}
        onBookClick={() => handleBookClick()}
        onMyBookingsClick={() => {}}
        onBarberClick={() => {}}
        isBarber={false}
      />
      <HeroSection onBookClick={() => handleBookClick()} />
      <ServicesSection />
      <BarbersSection onBookWithBarber={handleBookWithBarber} />
      <MasterpieceSection />
      <AboutSection />
      <Footer />
      <WhatsAppButton />

      <BookingModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        selectedBarber={selectedBarber}
      />
    </div>
  );
}
