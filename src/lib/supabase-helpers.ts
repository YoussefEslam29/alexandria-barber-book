import { supabase } from "@/integrations/supabase/client";

// ───────────────────────────────────────────────
// Services
// ───────────────────────────────────────────────
export async function getServices() {
  const { data, error } = await supabase.from("services").select("*").order("price");
  if (error) throw error;
  return data;
}

// ───────────────────────────────────────────────
// Customers (loyalty tracking by phone number)
// ───────────────────────────────────────────────
export async function findOrCreateCustomer(
  fullName: string,
  phone: string,
  email: string
): Promise<{ id: string; visit_count: number }> {
  // Try to find existing customer by phone
  const { data: existing } = await supabase
    .from("customers" as any)
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    // Increment visit count
    const newCount = ((existing as any).visit_count || 0) + 1;
    await supabase
      .from("customers" as any)
      .update({ visit_count: newCount, full_name: fullName, email } as any)
      .eq("id", (existing as any).id);
    return { id: (existing as any).id, visit_count: newCount };
  }

  // Create new customer
  const { data: newCustomer, error } = await supabase
    .from("customers" as any)
    .insert({ full_name: fullName, phone, email, visit_count: 1 } as any)
    .select()
    .single();

  if (error) throw error;
  return { id: (newCustomer as any).id, visit_count: 1 };
}

// ───────────────────────────────────────────────
// Bookings (frictionless — no auth required)
// ───────────────────────────────────────────────
export async function createPublicBooking(params: {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  barber: string;
  notes?: string;
}) {
  // Find or create customer first (for visit tracking)
  const customer = await findOrCreateCustomer(
    params.customer_name,
    params.customer_phone,
    params.customer_email
  );

  // Create the booking
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      customer_name: params.customer_name,
      customer_phone: params.customer_phone,
      customer_email: params.customer_email,
      service_id: params.service_id,
      booking_date: params.booking_date,
      booking_time: params.booking_time,
      barber: params.barber,
      notes: params.notes,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return { booking: data, customer };
}

// ─── Legacy createBooking kept for compatibility ───
export async function createBooking(params: {
  user_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}) {
  const { data, error } = await supabase.from("bookings").insert(params).select().single();
  if (error) throw error;
  return data;
}

// ───────────────────────────────────────────────
// Admin queries (still require auth via admin login)
// ───────────────────────────────────────────────
export async function getAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(*)")
    .order("booking_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllCustomers() {
  const { data, error } = await supabase
    .from("customers" as any)
    .select("*")
    .order("visit_count", { ascending: false });
  if (error) throw error;
  return data as any[];
}

export async function updateBookingStatus(bookingId: string, status: string) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
  if (error) throw error;
  return data;
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, user_id, full_name, phone, is_barber, created_at, updated_at, phone_number, age, role, email")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as any[];
}

export async function getBookingsPerBarber(): Promise<{ barber: string; count: number }[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("barber")
    .not("barber", "is", null)
    .neq("barber", "");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as any[]) {
    const b = (row.barber as string) || "Unassigned";
    counts[b] = (counts[b] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([barber, count]) => ({ barber, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(*)")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });
  if (error) throw error;
  return data;
}
