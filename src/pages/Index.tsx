import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import BookingTracker from "@/components/BookingTracker";
import WhatsAppButton from "@/components/WhatsAppButton";
import BarbersSection from "@/components/BarbersSection";
import MasterpieceSection from "@/components/MasterpieceSection";
import ExperienceSection from "@/components/ExperienceSection";
import PremiumServiceSection from "@/components/PremiumServiceSection";

export default function Index() {
  const [bookOpen, setBookOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<string | undefined>(undefined);
  const [isHomeService, setIsHomeService] = useState(false);

  const handleBookClick = (barberName?: string, homeService = false) => {
    setSelectedBarber(barberName);
    setIsHomeService(homeService);
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
        onMyBookingsClick={() => setTrackOpen(true)}
        onBarberClick={() => {}}
        isBarber={false}
      />
      <HeroSection onBookClick={() => handleBookClick()} />
      <ExperienceSection />
      <ServicesSection />
      <PremiumServiceSection onBookPremium={() => handleBookClick(undefined, true)} />
      <BarbersSection onBookWithBarber={handleBookWithBarber} />
      <MasterpieceSection />
      <AboutSection />
      <Footer />
      <WhatsAppButton />

      <BookingModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        selectedBarber={selectedBarber}
        isHomeServiceDefault={isHomeService}
      />

      <BookingTracker
        open={trackOpen}
        onClose={() => setTrackOpen(false)}
      />
    </div>
  );
}
