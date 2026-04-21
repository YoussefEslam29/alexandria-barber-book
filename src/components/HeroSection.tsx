import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import heroImg from "@/assets/hero-barbershop.jpg";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSectionProps {
  onBookClick: () => void;
}

const customEase = [0.16, 1, 0.3, 1];

export default function HeroSection({ onBookClick }: HeroSectionProps) {
  const { t } = useLanguage();
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = btnRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    // Limit to ~20px radius
    setBtnPos({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.9, ease: customEase },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0">
        <motion.img 
          src={heroImg} 
          alt="Kral Salon barbershop interior" 
          className="w-full h-full object-cover opacity-30 grayscale mix-blend-luminosity origin-center"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
      </div>
      
      <motion.div 
        className="relative z-10 text-center px-4 max-w-3xl mx-auto mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="overflow-hidden mb-4">
          <motion.p variants={textVariants} className="text-primary font-label text-sm tracking-[0.3em] uppercase">Alexandria's Premier Barbershop</motion.p>
        </div>
        
        <div className="overflow-hidden mb-6">
          <motion.h1 variants={textVariants} className="font-heading text-5xl md:text-7xl lg:text-8xl text-foreground leading-tight tracking-tight">
            Kral <span className="italic text-primary">Salon</span>
          </motion.h1>
        </div>
        
        <div className="overflow-hidden mb-10">
          <motion.p variants={textVariants} className="text-muted-foreground font-body text-lg md:text-xl max-w-xl mx-auto font-light">
            {t("heroDescription")}
          </motion.p>
        </div>

        <motion.div 
          variants={textVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: btnPos.x, y: btnPos.y }}
            transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.5 }}
            className="w-full sm:w-auto p-4 -m-4" // padding wrapper to increase hover area
          >
            <Button 
              onClick={onBookClick} 
              size="lg" 
              className="text-primary-foreground font-label tracking-widest uppercase bg-primary-gradient hover:opacity-90 border-none rounded-md px-10 py-7 text-base shadow-[0_0_20px_rgba(0,219,231,0.2)] w-full sm:w-auto"
            >
              {t("bookAppointment")}
            </Button>
          </motion.div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="ghost-border text-foreground font-label tracking-widest uppercase hover:bg-surface-container-high transition-all rounded-md px-10 py-7 text-base w-full sm:w-auto relative z-10"
          >
            <a href="#services">{t("exploreServices")}</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
