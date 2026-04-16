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
import { getServices, createBooking } from "@/lib/supabase-helpers";

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
  userId: string;
  selectedBarber?: string;
}

export default function BookingModal({ open, onClose, userId, selectedBarber }: BookingModalProps) {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [barber, setBarber] = useState(selectedBarber || BARBER_OPTIONS[0]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lang, t } = useLanguage();

  // Sync when selectedBarber prop changes (from barber card click)
  if (selectedBarber && selectedBarber !== barber && open) {
    setBarber(selectedBarber);
  }

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({ title: t("booked"), description: t("appointmentConfirmed") });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      setServiceId("");
      setDate("");
      setTime("");
      setNotes("");
      setBarber(BARBER_OPTIONS[0]);

      // Smooth scroll to contacts/about section after modal closes
      setTimeout(() => {
        document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    },
    onError: (err: any) => {
      toast({ title: t("bookingFailed"), description: err.message, variant: "destructive" });
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const noteStr = [
      barber !== BARBER_OPTIONS[0] ? `Barber: ${barber}` : "",
      notes,
    ].filter(Boolean).join(" | ");

    mutation.mutate({
      user_id: userId,
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      notes: noteStr || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface-container-highest ghost-border ambient-shadow max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl text-foreground mb-2">{t("bookAppointmentTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Barber preference */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("chooseBarber")}</Label>
            <Select value={barber} onValueChange={setBarber}>
              <SelectTrigger className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2">
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
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2">
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
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
          </div>

          {/* Time */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("time")}</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2">
                <SelectValue placeholder={t("selectTime")} />
              </SelectTrigger>
              <SelectContent className="bg-surface-container-high ghost-border">
                {TIME_SLOTS.map((slot) => (
                  <SelectItem key={slot} value={slot} className="hover:bg-surface-container focus:bg-surface-container focus:text-primary">{slot}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("notesOptional")}</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPlaceholder")} className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-gradient hover:opacity-90 text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_15px_rgba(0,219,231,0.2)] mt-4"
            disabled={mutation.isPending || !serviceId || !date || !time}
          >
            {mutation.isPending ? t("booking") : t("confirmBooking")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
