import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllBookings, updateBookingStatus } from "@/lib/supabase-helpers";
import { useToast } from "@/hooks/use-toast";
import { formatTime12h } from "@/lib/utils";
import { CalendarDays, Clock, User } from "lucide-react";

interface BarberDashboardProps {
  open: boolean;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function BarberDashboard({ open, onClose }: BarberDashboardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: getAllBookings,
    enabled: open,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast({ title: "Booking updated" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">Barber Dashboard</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : !bookings?.length ? (
          <p className="text-muted-foreground text-center py-8">No bookings.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="bg-muted rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-heading text-foreground">{b.services?.name}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      <User className="h-3 w-3" />{b.profiles?.full_name || "Unknown"}
                    </p>
                  </div>
                  <Badge className={statusColors[b.status] || ""} variant="outline">{b.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{b.booking_date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime12h(b.booking_time)}</span>
                  <span className="text-primary">{b.services?.price} EGP</span>
                </div>
                {b.notes && <p className="text-muted-foreground text-xs mb-3">Notes: {b.notes}</p>}
                <div className="flex gap-2">
                  {b.status === "pending" && (
                    <Button size="sm" onClick={() => statusMutation.mutate({ id: b.id, status: "confirmed" })}>Confirm</Button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <Button size="sm" variant="secondary" onClick={() => statusMutation.mutate({ id: b.id, status: "completed" })}>Complete</Button>
                  )}
                  {b.status !== "cancelled" && b.status !== "completed" && (
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => statusMutation.mutate({ id: b.id, status: "cancelled" })}>Cancel</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
