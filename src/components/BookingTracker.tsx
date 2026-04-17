import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBookingsByPhone } from "@/lib/supabase-helpers";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatTime12h } from "@/lib/utils";
import { CalendarDays, Clock, Search, Scissors, AlertCircle } from "lucide-react";

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: "statusPending",   cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  accepted:  { label: "statusAccepted",  cls: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  confirmed: { label: "statusConfirmed", cls: "bg-green-500/20 text-green-400 border-green-500/30" },
  completed: { label: "statusCompleted", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  cancelled: { label: "statusCancelled", cls: "bg-red-500/20 text-red-400 border-red-500/30" },
  rejected:  { label: "statusRejected",  cls: "bg-red-500/20 text-red-400 border-red-500/30" },
};

interface BookingTrackerProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingTracker({ open, onClose }: BookingTrackerProps) {
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const { t } = useLanguage();

  const { data: bookings, isLoading, isFetched } = useQuery({
    queryKey: ["track-bookings", searchPhone],
    queryFn: () => getBookingsByPhone(searchPhone),
    enabled: !!searchPhone,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) setSearchPhone(phone.trim());
  };

  const inputClass = "bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface-container-highest ghost-border ambient-shadow max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground mb-2">{t("trackMyBooking")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearch} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("phoneNumber")}</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-primary-gradient text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_10px_rgba(0,219,231,0.15)] mb-[2px]"
            disabled={!phone.trim()}
          >
            <Search className="h-4 w-4 mr-1" />
            {t("search")}
          </Button>
        </form>

        {isLoading && (
          <p className="text-muted-foreground text-center py-6 text-sm">{t("loading")}</p>
        )}

        {isFetched && !isLoading && (!bookings || bookings.length === 0) && (
          <p className="text-muted-foreground text-center py-6 text-sm">{t("noAppointmentsFound")}</p>
        )}

        {bookings && bookings.length > 0 && (
          <div className="space-y-3 mt-2">
            <p className="text-xs font-label text-muted-foreground uppercase tracking-widest">{t("yourAppointments")}</p>
            {bookings.map((b: any) => {
              const sc = statusConfig[b.status] || statusConfig.pending;
              return (
                <div key={b.id} className="bg-surface rounded-lg p-4 border border-surface-container-high hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-foreground text-sm">{(b as any).services?.name || "Service"}</h3>
                    <Badge className={`text-xs ${sc.cls}`} variant="outline">
                      {t(sc.label as any)}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-1">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{b.booking_date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime12h(b.booking_time)}</span>
                    {b.barber && <span className="flex items-center gap-1"><Scissors className="h-3 w-3" />{b.barber}</span>}
                    <span className="text-primary font-medium">{(b as any).services?.price} EGP</span>
                  </div>

                  {/* Rejection reason */}
                  {b.status === "rejected" && (b as any).rejection_reason && (
                    <div className="mt-2 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-md p-2">
                      <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-400">
                        <span className="font-label uppercase tracking-wider">{t("rejectionReason")}:</span>{" "}
                        {(b as any).rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Pending indicator animation */}
                  {b.status === "pending" && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-xs text-yellow-400 font-label">{t("statusPending")}</span>
                    </div>
                  )}

                  {/* Accepted indicator */}
                  {b.status === "accepted" && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,219,231,0.5)]" />
                      <span className="text-xs text-cyan-400 font-label">{t("statusAccepted")}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
