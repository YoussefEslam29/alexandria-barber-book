import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, getAllBookings, updateBookingStatus, getAllProfiles } from "@/lib/supabase-helpers";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import kralLogo from "@/assets/kral-logo.png";
import {
  CalendarDays,
  Clock,
  User,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
  Filter,
  LayoutDashboard,
  LogIn,
  LogOut,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-3">
          <img src={kralLogo} alt="Kral Salon" className="h-16 w-16 rounded-full object-cover mx-auto" />
          <CardTitle className="font-heading text-2xl text-foreground">Admin Dashboard</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in with your admin credentials</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-muted-foreground">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-muted border-border" />
            </div>
            <div>
              <Label htmlFor="admin-password" className="text-muted-foreground">Password</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-muted border-border" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBarber, setIsBarber] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [usersSearch, setUsersSearch] = useState("");

  const checkBarberStatus = async (userId: string) => {
    try {
      const p = await getProfile(userId);
      if (p?.is_barber) {
        setIsBarber(true);
        setAuthChecked(true);
      } else {
        toast({ title: "Access denied", description: "This account does not have admin privileges.", variant: "destructive" });
        await supabase.auth.signOut();
        setIsBarber(false);
        setAuthChecked(false);
      }
    } catch {
      toast({ title: "Error", description: "Could not verify admin status.", variant: "destructive" });
      await supabase.auth.signOut();
    }
  };

  useEffect(() => {
    if (!loading && user) {
      checkBarberStatus(user.id);
    }
    if (!loading && !user) {
      setIsBarber(false);
      setAuthChecked(false);
    }
  }, [user, loading]);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: getAllBookings,
    enabled: isBarber,
    refetchInterval: 30000,
  });

  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: getAllProfiles,
    enabled: isBarber,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking updated successfully" });
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !authChecked || !isBarber) {
    return <AdminLoginForm onLogin={() => { /* auth state change will trigger useEffect */ }} />;
  }

  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b: any) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b: any) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b: any) => b.status === "completed").length;
  const cancelledCount = bookings.filter((b: any) => b.status === "cancelled").length;
  const totalRevenue = bookings
    .filter((b: any) => b.status === "completed")
    .reduce((sum: number, b: any) => sum + (b.services?.price || 0), 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b: any) => b.booking_date === todayStr).length;

  const filtered = bookings.filter((b: any) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      (b.profiles?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.services?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredProfiles = profiles.filter((p: any) =>
    !usersSearch ||
    (p.full_name || "").toLowerCase().includes(usersSearch.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(usersSearch.toLowerCase()) ||
    (p.phone_number || "").includes(usersSearch)
  );

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: "text-primary" },
    { label: "Today", value: todayBookings, icon: TrendingUp, color: "text-green-400" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-400" },
    { label: "Completed", value: completedCount, icon: CheckCircle, color: "text-blue-400" },
    { label: "Cancelled", value: cancelledCount, icon: XCircle, color: "text-red-400" },
    { label: "Revenue", value: `${totalRevenue} EGP`, icon: DollarSign, color: "text-primary" },
  ];

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-heading text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary text-primary">
              Kral Salon
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className={`text-xl font-heading font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Bookings</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Registered Users</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <Button
                    key={f.value}
                    size="sm"
                    variant={statusFilter === f.value ? "default" : "outline"}
                    onClick={() => setStatusFilter(f.value)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bookings List */}
            {isLoading ? (
              <p className="text-muted-foreground text-center py-12">Loading bookings...</p>
            ) : !filtered.length ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((b: any) => (
                  <Card key={b.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading text-foreground font-semibold truncate">
                              {b.services?.name || "Unknown Service"}
                            </h3>
                            <Badge className={statusColors[b.status] || ""} variant="outline">
                              {b.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {b.profiles?.full_name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {b.booking_date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {b.booking_time}
                            </span>
                            <span className="text-primary font-medium">
                              {b.services?.price} EGP
                            </span>
                          </div>
                          {b.notes && (
                            <p className="text-xs text-muted-foreground mt-1">Notes: {b.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {b.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => statusMutation.mutate({ id: b.id, status: "confirmed" })}
                              disabled={statusMutation.isPending}
                            >
                              Confirm
                            </Button>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => statusMutation.mutate({ id: b.id, status: "completed" })}
                              disabled={statusMutation.isPending}
                            >
                              Complete
                            </Button>
                          )}
                          {b.status !== "cancelled" && b.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => statusMutation.mutate({ id: b.id, status: "cancelled" })}
                              disabled={statusMutation.isPending}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or phone..."
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>
            
            <Card className="bg-card border-border">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-heading text-primary">Name</TableHead>
                      <TableHead className="font-heading text-primary">Email</TableHead>
                      <TableHead className="font-heading text-primary">Phone</TableHead>
                      <TableHead className="font-heading text-primary w-[80px]">Age</TableHead>
                      <TableHead className="font-heading text-primary text-right">Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingProfiles ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading users...</TableCell>
                      </TableRow>
                    ) : filteredProfiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No users found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredProfiles.map((userProfile: any) => (
                        <TableRow key={userProfile.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="font-medium text-foreground">{userProfile.full_name || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{userProfile.email || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{userProfile.phone_number || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{userProfile.age || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={userProfile.is_barber ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground"}>
                              {userProfile.is_barber ? "Admin" : (userProfile.role || "User")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
