import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserBookings, updateBookingStatus } from "@/lib/supabase-helpers";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock } from "lucide-react";

interface MyBookingsProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function MyBookings({ open, onClose, userId }: MyBookingsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => getUserBookings(userId),
    enabled: open,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => updateBookingStatus(bookingId, "cancelled"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({ title: "Booking cancelled" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">My Bookings</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : !bookings?.length ? (
          <p className="text-muted-foreground text-center py-8">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="bg-muted rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading text-foreground">{b.services?.name}</h3>
                  <Badge className={statusColors[b.status] || ""} variant="outline">{b.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground text-sm mb-2">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{b.booking_date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{b.booking_time}</span>
                </div>
                <p className="text-primary text-sm">{b.services?.price} EGP</p>
                {b.status === "pending" && (
                  <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => cancelMutation.mutate(b.id)}>
                    Cancel
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
