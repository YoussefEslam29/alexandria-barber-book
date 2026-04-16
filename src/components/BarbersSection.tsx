import { useLanguage } from "@/i18n/LanguageContext";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarbersSectionProps {
  onBookWithBarber: (barberName: string) => void;
}

const BARBERS = [
  {
    id: 1,
    name: "Ahmed Kral",
    nameAr: "أحمد كرال",
    specialty: "Master of Fades & Classic Cuts",
    specialtyAr: "خبير القصات الكلاسيكية والفيد",
    bio: "With over 8 years behind the chair, Ahmed is the cornerstone of the Kral experience. His precision fades and clean lines are unmatched in Alexandria.",
    bioAr: "بخبرة تزيد على 8 سنوات، أحمد هو ركيزة تجربة كرال. قصاته الدقيقة لا مثيل لها في الإسكندرية.",
    image: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Omar Khalil",
    nameAr: "عمر خليل",
    specialty: "Beard Sculpting Specialist",
    specialtyAr: "أخصائي تشكيل اللحى",
    bio: "Omar's artistry with the blade transforms every beard into a signature statement. Known for his hot towel treatments and meticulous attention to detail.",
    bioAr: "عمر يحوّل كل لحية إلى تحفة فنية. معروف بالمناشف الساخنة واهتمامه الشديد بالتفاصيل.",
    image: "https://images.unsplash.com/photo-1587909209111-5097ee578ec3?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Youssef Adel",
    nameAr: "يوسف عادل",
    specialty: "Modern Styles & Textured Cuts",
    specialtyAr: "القصات العصرية والملمسية",
    bio: "Youssef brings a contemporary edge to the Kral aesthetic. His expertise in textured cuts and modern styles keeps clients coming back.",
    bioAr: "يوسف يُضفي لمسة عصرية على أسلوب كرال. خبرته في القصات العصرية تجعل العملاء يعودون دائماً.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
  },
];

export default function BarbersSection({ onBookWithBarber }: BarbersSectionProps) {
  const { lang, t } = useLanguage();

  return (
    <section id="barbers" className="py-32 px-4 bg-surface-container-low border-t border-surface-container">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <p className="text-primary font-label text-sm tracking-[0.3em] uppercase mb-3">{t("meetTheTeam")}</p>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-tight">
            The <span className="text-primary italic">Barbers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BARBERS.map((barber) => (
            <div
              key={barber.id}
              className="group bg-surface ghost-border rounded-md overflow-hidden hover:bg-surface-container-high transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={barber.image}
                  alt={lang === "ar" ? barber.nameAr : barber.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Scissors className="h-4 w-4 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-2xl text-foreground mb-1">
                  {lang === "ar" ? barber.nameAr : barber.name}
                </h3>
                <p className="text-primary font-label text-xs uppercase tracking-widest mb-4">
                  {lang === "ar" ? barber.specialtyAr : barber.specialty}
                </p>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 flex-1">
                  {lang === "ar" ? barber.bioAr : barber.bio}
                </p>
                <Button
                  onClick={() => onBookWithBarber(barber.name)}
                  className="w-full bg-surface-container-high hover:bg-primary hover:text-primary-foreground text-foreground font-label tracking-widest uppercase ghost-border transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,219,231,0.15)]"
                >
                  {t("bookWithMe")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
