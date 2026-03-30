import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getServices, createBooking } from "@/lib/supabase-helpers";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

export default function BookingModal({ open, onClose, userId }: BookingModalProps) {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast({ title: "Booked!", description: "Your appointment has been confirmed." });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
      setServiceId("");
      setDate("");
      setTime("");
      setNotes("");
    },
    onError: (err: any) => {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      user_id: userId,
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">Book Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Service</Label>
            <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {services?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.price} EGP
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground">Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className="bg-muted border-border" />
          </div>
          <div>
            <Label className="text-muted-foreground">Time</Label>
            <Select value={time} onValueChange={setTime} required>
              <SelectTrigger className="bg-muted border-border">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-muted-foreground">Notes (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests..." className="bg-muted border-border" />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending || !serviceId || !date || !time}>
            {mutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
