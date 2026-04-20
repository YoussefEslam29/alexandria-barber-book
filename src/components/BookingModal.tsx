import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { getServices, createPublicBooking } from "@/lib/supabase-helpers";
import { formatTime12h } from "@/lib/utils";

const BARBER_OPTIONS = ["Any available barber", "Ahmed Kral", "Omar Khalil", "Youssef Adel"];

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  selectedBarber?: string;
  isHomeServiceDefault?: boolean;
}

export default function BookingModal({ open, onClose, selectedBarber, isHomeServiceDefault = false }: BookingModalProps) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [barber, setBarber] = useState(selectedBarber || BARBER_OPTIONS[0]);
  const [isHomeService, setIsHomeService] = useState(isHomeServiceDefault);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lang, t } = useLanguage();

  // Sync when selectedBarber prop changes (from barber card click)
  if (selectedBarber && selectedBarber !== barber && open) {
    setBarber(selectedBarber);
  }
  if (isHomeServiceDefault !== isHomeService && open) {
    setIsHomeService(isHomeServiceDefault);
  }

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const mutation = useMutation({
    mutationFn: createPublicBooking,
    onSuccess: (result) => {
      const visitMsg = result.customer.visit_count >= 5
        ? " 🎉 You're close to your FREE 6th visit!"
        : "";
      toast({
        title: "✅ " + t("booked"),
        description: (t("appointmentConfirmed") || "Your appointment request has been submitted.") + visitMsg,
      });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      onClose();
      resetForm();
    },
    onError: (err: any) => {
      toast({ title: t("bookingFailed"), description: err.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFullName("");
    setAge("");
    setPhone("");
    setEmail("");
    setServiceId("");
    setDate("");
    setTime("");
    setNotes("");
    setBarber(BARBER_OPTIONS[0]);
    setIsHomeService(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email,
      customer_age: age ? parseInt(age) : undefined,
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      barber: barber !== BARBER_OPTIONS[0] ? barber : "",
      notes: notes || undefined,
      is_home_service: isHomeService,
    });
  };

  const handleServiceChange = (val: string) => {
    const selectedService = services?.find(s => s.id === val);
    const isKidsService = selectedService?.name.toLowerCase().includes("kid") || selectedService?.name_ar?.includes("أطفال");
    
    if (isKidsService && age && parseInt(age) > 12) {
      toast({
        title: "Not Allowed",
        description: "The Kids Service is strictly for those aged 12 and under. Please select a standard or premium cut.",
        variant: "destructive"
      });
      return;
    }
    setServiceId(val);
  };

  const inputClass = "bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface-container-highest ghost-border ambient-shadow max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl text-foreground mb-2">{t("bookAppointmentTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("fullName")}</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Ahmed Mohamed"
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("age")}</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="25"
              className={inputClass}
              min="1"
              max="120"
            />
          </div>
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("phoneNumber")}</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </div>
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("email")}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="optional@email.com"
              className={inputClass}
            />
          </div>

          <div className="h-[1px] bg-surface-container-high my-2" />

          {/* Barber preference */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("chooseBarber")}</Label>
            <Select value={barber} onValueChange={setBarber}>
              <SelectTrigger className={inputClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-high ghost-border">
                {BARBER_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name} className="hover:bg-surface-container focus:bg-surface-container focus:text-primary">
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("service")}</Label>
            <Select value={serviceId} onValueChange={handleServiceChange} required>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder={t("selectService")} />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-high ghost-border">
                {services?.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="hover:bg-surface-container focus:bg-surface-container focus:text-primary">
                    {lang === "ar" && s.name_ar ? s.name_ar : s.name} — {s.price} EGP
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("date")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className={inputClass} />
          </div>

          {/* Time */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("time")}</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger className={inputClass}>
                <SelectValue placeholder={t("selectTime")} />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-high ghost-border">
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot} className="hover:bg-surface-container focus:bg-surface-container focus:text-primary">
                    {formatTime12h(slot)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("notesOptional")}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPlaceholder")} className={inputClass} />
          </div>

          {/* Premium Home Service Toggle */}
          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="home-service" 
              checked={isHomeService} 
              onChange={(e) => setIsHomeService(e.target.checked)}
              className="rounded border-surface-container-high text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4 bg-surface"
            />
            <Label htmlFor="home-service" className="text-sm font-label text-[#D4AF37] tracking-wider cursor-pointer">
              {t("premiumGroomingAtHome")}
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-gradient hover:opacity-90 text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_15px_rgba(0,219,231,0.2)] mt-4"
            disabled={mutation.isPending || !fullName || !phone || !serviceId || !date || !time || !age}
          >
            {mutation.isPending ? t("booking") : t("confirmBooking")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
