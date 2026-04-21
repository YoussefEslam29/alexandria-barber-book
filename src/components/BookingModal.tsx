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
import { getServices, createPublicBooking, HOME_SERVICE_FEE } from "@/lib/supabase-helpers";
import { formatTime12h } from "@/lib/utils";
import { CheckCircle, CalendarDays, Download, MapPin, Crown, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);
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
      setIsSuccess(true);
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
    setAddress("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      resetForm();
      setIsSuccess(false);
      setStep(1);
    }, 300);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNotes = isHomeService && address ? `Address: ${address}\n\n${notes}` : notes;
    mutation.mutate({
      customer_name: fullName,
      customer_phone: phone,
      customer_email: email,
      customer_age: age ? parseInt(age) : undefined,
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      barber: barber !== BARBER_OPTIONS[0] ? barber : "",
      notes: finalNotes || undefined,
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

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  const isStep1Valid = fullName && age && phone.length === 11 && phone.startsWith("01");
  const isStep2Valid = serviceId && date && time && (!isHomeService || address);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-surface-container-highest ghost-border ambient-shadow max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div 
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,175,55,0.3)] relative"
            >
              <Crown className="w-10 h-10 text-[#D4AF37]" />
              <motion.div 
                className="absolute inset-0 border border-[#D4AF37] rounded-full pointer-events-none"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.div>
            <h3 className="font-heading text-3xl text-foreground mb-2">Booking Confirmed</h3>
            <p className="text-muted-foreground mb-8">Your chair is waiting, {fullName.split(' ')[0]}. We've reserved your time slot.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Button className="w-full bg-primary-gradient text-primary-foreground font-label uppercase tracking-widest border-none" onClick={() => {
                toast({ title: "Added to Calendar", description: "Your appointment has been added." });
                handleClose();
              }}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Done
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col h-full overflow-y-auto pr-2 pb-2">
            <DialogHeader className="mb-6">
              <DialogTitle className="font-heading text-3xl text-foreground mb-1">{t("bookAppointmentTitle")}</DialogTitle>
              <div className="flex items-center gap-2 text-xs font-label text-muted-foreground tracking-widest uppercase">
                <span className={step >= 1 ? "text-primary" : ""}>01. Info</span>
                <span className="w-4 h-[1px] bg-surface-container-high" />
                <span className={step >= 2 ? "text-primary" : ""}>02. Service</span>
                <span className="w-4 h-[1px] bg-surface-container-high" />
                <span className={step >= 3 ? "text-primary" : ""}>03. Details</span>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-x-hidden relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("fullName")}</Label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Ahmed Mohamed" className={inputClass} />
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("age")}</Label>
                      <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="25" className={inputClass} min="1" max="120" />
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("phoneNumber")}</Label>
                      <Input type="tel" value={phone} onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val === "" || val === "0" || (val.startsWith("01") && val.length <= 11)) {
                          setPhone(val);
                        }
                      }} required placeholder="01XXXXXXXXX" className={inputClass} />
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("email")}</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="optional@email.com" className={inputClass} />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
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
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("chooseBarber")}</Label>
                      <Select value={barber} onValueChange={setBarber}>
                        <SelectTrigger className={inputClass}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-container-high ghost-border">
                          {BARBER_OPTIONS.map((name) => (
                            <SelectItem key={name} value={name} className="hover:bg-surface-container focus:bg-surface-container focus:text-primary">{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("date")}</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className={inputClass} />
                    </div>
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
                    <div className="flex items-center space-x-2 py-2">
                      <input type="checkbox" id="home-service" checked={isHomeService} onChange={(e) => setIsHomeService(e.target.checked)} className="rounded border-surface-container-high text-[#D4AF37] focus:ring-[#D4AF37] h-4 w-4 bg-surface" />
                      <Label htmlFor="home-service" className="text-sm font-label text-[#D4AF37] tracking-wider cursor-pointer">{t("premiumGroomingAtHome")}</Label>
                    </div>
                    {isHomeService && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <Label className="text-[#D4AF37] font-label text-xs uppercase tracking-widest flex items-center gap-2 mb-2"><MapPin className="h-3 w-3" /> Your Location in Alexandria</Label>
                        <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required={isHomeService} placeholder="Building, Street, Area..." className={`${inputClass} border-[#D4AF37]/30 focus:border-[#D4AF37] focus:ring-[#D4AF37] mt-0`} />
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("notesOptional")}</Label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPlaceholder")} className={inputClass} rows={4} />
                    </div>
                    
                    <div className="bg-surface-container p-4 rounded-md border border-surface-container-high mt-4 space-y-3">
                      <h4 className="font-heading text-lg text-foreground border-b border-surface-container-high pb-2">Summary</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-foreground">{fullName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">{date} at {time && formatTime12h(time)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service:</span>
                        <span className="text-foreground">
                          {services?.find(s => s.id === serviceId)?.name}
                        </span>
                      </div>
                      {isHomeService && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#D4AF37]">Home Service:</span>
                          <span className="text-[#D4AF37]">{HOME_SERVICE_FEE} EGP</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-surface-container-high pt-2 mt-2">
                        <span className="font-label uppercase tracking-widest text-muted-foreground text-xs">Total Estimate</span>
                        <span className="font-heading text-xl text-primary">
                          {serviceId ? (services?.find(s => s.id === serviceId)?.price || 0) + (isHomeService ? HOME_SERVICE_FEE : 0) : "0"} EGP
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-surface-container">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1 ghost-border text-foreground">
                  <ChevronLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={() => setStep(step + 1)} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={mutation.isPending} className="flex-1 bg-primary-gradient hover:opacity-90 text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_15px_rgba(0,219,231,0.2)]">
                  {mutation.isPending ? t("booking") : t("confirmBooking")}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
