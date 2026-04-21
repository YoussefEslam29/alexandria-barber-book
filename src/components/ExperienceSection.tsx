import { Shield, Sparkles, CalendarClock, UserCheck } from "lucide-react";
import video1 from "@/assets/kral salon video 1.mp4";
import video2 from "@/assets/kral salon video 2.mp4";
import video3 from "@/assets/kral salon video 3.mp4";
import { useLanguage } from "@/i18n/LanguageContext";
import { TranslationKey } from "@/i18n/translations";
import { motion } from "framer-motion";

const FEATURES: { icon: any; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    icon: Sparkles,
    titleKey: "expFeature1Title",
    descKey: "expFeature1Desc",
  },
  {
    icon: Shield,
    titleKey: "expFeature2Title",
    descKey: "expFeature2Desc",
  },
  {
    icon: CalendarClock,
    titleKey: "expFeature3Title",
    descKey: "expFeature3Desc",
  },
  {
    icon: UserCheck,
    titleKey: "expFeature4Title",
    descKey: "expFeature4Desc",
  },
];

const STEPS: { number: string; titleKey: TranslationKey; descKey: TranslationKey }[] = [
  {
    number: "01",
    titleKey: "expStep1Title",
    descKey: "expStep1Desc",
  },
  {
    number: "02",
    titleKey: "expStep2Title",
    descKey: "expStep2Desc",
  },
  {
    number: "03",
    titleKey: "expStep3Title",
    descKey: "expStep3Desc",
  },
];

const videos = [video1, video2, video3];

const customEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: customEase },
  },
};

export default function ExperienceSection() {
  const { t, lang } = useLanguage();

  return (
    <section
      id="experience"
      className="py-32 px-4 bg-surface border-t border-surface-container"
    >
      <div className="container mx-auto max-w-6xl">
        {/* ── Bio ── */}
        <p className="font-heading italic text-muted-foreground text-lg md:text-xl text-center max-w-2xl mx-auto mb-16 leading-relaxed">
          {t("expBio1")}
          <span className="text-primary">{t("expBio2")}</span>
          {t("expBio3")}
        </p>

        {/* ── Video Grid ── */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-32" 
          dir="ltr"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {videos.map((src, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative rounded-2xl overflow-hidden shadow-[0_0_24px_rgba(0,219,231,0.15)] group"
            >
              <video
                src={src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-72 md:h-80 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-t from-surface/40 via-transparent to-transparent" />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Feature Grid ── */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-32" 
          dir="ltr"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.titleKey}
              variants={itemVariants}
              className="rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,219,231,0.1)] flex flex-col"
              style={{
                backgroundColor: "#0f0f0f",
                border: "1px solid rgba(0, 219, 231, 0.12)",
              }}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <f.icon className={`h-7 w-7 text-primary mb-5 ${lang === "ar" ? "mr-0 ml-auto" : ""}`} strokeWidth={1.5} />
              <h3 className="font-heading text-foreground text-lg mb-2">
                {t(f.titleKey)}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {t(f.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Effortless Booking ── */}
        <div>
          <div className="text-center mb-14">
            <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-3">
              {t("howItWorks")}
            </p>
            <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">
              {t("effortless")}{" "}
              <span className="italic text-primary">{t("bookingWord")}</span>
            </h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6" 
            dir="ltr"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {STEPS.map((s) => (
              <motion.div
                key={s.number}
                variants={itemVariants}
                className={`rounded-xl p-8 text-center ${lang === "ar" ? "md:text-right" : "md:text-left"} transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,219,231,0.1)] group`}
                style={{
                  backgroundColor: "#0f0f0f",
                  border: "1px solid rgba(0, 219, 231, 0.12)",
                }}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <span className={`font-heading text-5xl md:text-6xl text-primary/20 group-hover:text-primary/40 transition-colors duration-500 block mb-4`}>
                  {s.number}
                </span>
                <h3 className="font-heading text-xl text-foreground mb-3">
                  {t(s.titleKey)}
                </h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  {t(s.descKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
