import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getProfile, getAllBookings, updateBookingStatus, getAllCustomers, getAllProfiles, getBookingsPerBarber } from "@/lib/supabase-helpers";
import { formatTime12h } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
  Phone,
  Scissors,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowLeft,
  Search,
  LayoutDashboard,
  LogOut,
  Gift,
  Users,
  Crown,
  BarChart2,
  UserCheck,
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
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-surface-container-highest ghost-border ambient-shadow">
        <CardHeader className="text-center space-y-3">
          <img src={kralLogo} alt="Kral Salon" className="h-16 w-16 rounded-full object-cover mx-auto" />
          <CardTitle className="font-heading text-3xl text-foreground mt-4">Admin Access</CardTitle>
          <p className="text-sm font-label text-muted-foreground uppercase tracking-widest">Sign in to your atelier</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="admin-email" className="text-muted-foreground font-label text-xs uppercase tracking-widest">Email</Label>
              <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
            </div>
            <div>
              <Label htmlFor="admin-password" className="text-muted-foreground font-label text-xs uppercase tracking-widest">Password</Label>
              <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
            </div>
            {error && <p className="text-sm font-label text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary-gradient hover:opacity-90 text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_15px_rgba(0,219,231,0.2)] mt-4" disabled={loading}>
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
  const [customersSearch, setCustomersSearch] = useState("");

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

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: getAllCustomers,
    enabled: isBarber,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: getAllProfiles,
    enabled: isBarber,
  });

  const { data: barberChartData = [] } = useQuery({
    queryKey: ["admin-barber-chart"],
    queryFn: getBookingsPerBarber,
    enabled: isBarber,
    refetchInterval: 30000,
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

  const loyaltyReady = customers.filter((c: any) => c.visit_count >= 5).length;

  const filtered = bookings.filter((b: any) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      ((b as any).customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((b as any).customer_phone || "").includes(searchQuery) ||
      ((b as any).barber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.services?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const filteredCustomers = customers.filter((c: any) =>
    !customersSearch ||
    (c.full_name || "").toLowerCase().includes(customersSearch.toLowerCase()) ||
    (c.phone || "").includes(customersSearch) ||
    (c.email || "").toLowerCase().includes(customersSearch.toLowerCase())
  );

  const stats = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: "text-primary" },
    { label: "Today", value: todayBookings, icon: TrendingUp, color: "text-green-400" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-yellow-400" },
    { label: "Completed", value: completedCount, icon: CheckCircle, color: "text-blue-400" },
    { label: "Revenue", value: `${totalRevenue} EGP`, icon: DollarSign, color: "text-primary" },
    { label: "Loyalty (5+ visits)", value: loyaltyReady, icon: Gift, color: "text-pink-400" },
  ];

  // ── Business Intelligence ──
  const totalKings = profiles.length;
  const revenueForecast = totalBookings * 150;
  const topBarber = barberChartData[0]?.barber ?? "N/A";
  const profilesWithAge = profiles.filter((p: any) => p.age != null && p.age > 0).map((p: any) => p.age);
  const customersWithAge = customers.filter((c: any) => c.age != null && c.age > 0).map((c: any) => c.age);
  const allAges = [...profilesWithAge, ...customersWithAge];
  const avgAge = allAges.length
    ? Math.round(allAges.reduce((s: number, age: number) => s + age, 0) / allAges.length)
    : null;

  const biStats = [
    { label: "Total Kings", value: totalKings, icon: Users, color: "text-cyan-400", glow: "shadow-[0_0_18px_rgba(0,219,231,0.25)]" },
    { label: "Revenue Forecast", value: `${revenueForecast.toLocaleString()} EGP`, icon: DollarSign, color: "text-emerald-400", glow: "shadow-[0_0_18px_rgba(52,211,153,0.25)]" },
    { label: "Top Barber", value: topBarber, icon: Crown, color: "text-yellow-400", glow: "shadow-[0_0_18px_rgba(250,204,21,0.25)]" },
    { label: "Avg Client Age", value: avgAge != null ? `${avgAge} yrs` : "—", icon: UserCheck, color: "text-violet-400", glow: "shadow-[0_0_18px_rgba(167,139,250,0.25)]" },
  ];

  const getPersona = (profile: any): { label: string; cls: string } | null => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    if (profile.created_at >= sevenDaysAgo) return { label: "New Recruit", cls: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (profile.age != null && profile.age < 25) return { label: "Young Elite", cls: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };
    if (profile.age != null && profile.age >= 40) return { label: "The Sovereign", cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return null;
  };


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

        {/* ── Business Intelligence ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg text-foreground tracking-widest uppercase">Analytics Overview</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {biStats.map((s) => (
              <Card key={s.label} className={`bg-card border border-primary/30 ${s.glow}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                    <span className="text-xs font-label uppercase tracking-widest text-muted-foreground">{s.label}</span>
                  </div>
                  <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {barberChartData.length > 0 && (
            <Card className="bg-card border border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base text-foreground flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-primary" /> Appointments per Barber
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barberChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="barber" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(0,219,231,0.3)", borderRadius: "8px", color: "#e5e7eb" }}
                      cursor={{ fill: "rgba(0,219,231,0.05)" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {barberChartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "rgba(0,219,231,0.8)" : "rgba(0,219,231,0.35)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6 bg-card border border-border">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Bookings</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Customers & Loyalty</TabsTrigger>
          </TabsList>

          {/* ── BOOKINGS TAB ── */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, barber, or service..."
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
                              {b.customer_name || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {b.customer_phone || "-"}
                            </span>
                            {(b.customer_age || b.age) && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {b.customer_age || b.age} yrs
                              </span>
                            )}
                            {b.barber && (
                              <span className="flex items-center gap-1">
                                <Scissors className="h-3 w-3" />
                                {b.barber}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3 w-3" />
                              {b.booking_date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime12h(b.booking_time)}
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

          {/* ── CUSTOMERS & LOYALTY TAB ── */}
          <TabsContent value="customers" className="space-y-6">

            {/* Client Insights (from profiles) */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg text-foreground tracking-widest uppercase">Client Insights</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profiles.length === 0 ? (
                  <p className="text-muted-foreground text-sm col-span-3">No registered users yet.</p>
                ) : (
                  profiles.map((p: any) => {
                    const persona = getPersona(p);
                    return (
                      <Card key={p.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-heading text-foreground truncate">{p.full_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{p.email || p.phone_number || "—"}</p>
                            {p.age && <p className="text-xs text-muted-foreground">Age: {p.age}</p>}
                          </div>
                          {persona && (
                            <Badge className={`shrink-0 text-xs ${persona.cls}`} variant="outline">
                              {persona.label}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Loyalty customers table */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, phone, or email..."
                value={customersSearch}
                onChange={(e) => setCustomersSearch(e.target.value)}
                className="pl-9 bg-card border-border"
              />
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-heading text-primary">Name</TableHead>
                      <TableHead className="font-heading text-primary">Age</TableHead>
                      <TableHead className="font-heading text-primary">Phone</TableHead>
                      <TableHead className="font-heading text-primary">Email</TableHead>
                      <TableHead className="font-heading text-primary w-[100px]">Visits</TableHead>
                      <TableHead className="font-heading text-primary text-right">Loyalty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingCustomers ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading customers...</TableCell>
                      </TableRow>
                    ) : filteredCustomers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No customers found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredCustomers.map((c: any) => (
                        <TableRow key={c.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                          <TableCell className="font-medium text-foreground">{c.full_name || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{c.age || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{c.phone || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{c.email || "-"}</TableCell>
                          <TableCell>
                            <span className={`font-heading font-bold ${c.visit_count >= 5 ? "text-primary" : "text-foreground"}`}>
                              {c.visit_count}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {c.visit_count >= 5 ? (
                              <Badge className="bg-primary/20 text-primary border-primary/30" variant="outline">
                                <Gift className="h-3 w-3 mr-1" />
                                Free 6th Visit!
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {5 - c.visit_count} visits to go
                              </span>
                            )}
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
