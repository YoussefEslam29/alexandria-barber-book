import { supabase } from "@/integrations/supabase/client";

export async function getServices() {
  const { data, error } = await supabase.from("services").select("*").order("price");
  if (error) throw error;
  return data;
}

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

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(*)")
    .eq("user_id", userId)
    .order("booking_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllBookings() {
  // Fetch bookings with their services
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, services(*)")
    .order("booking_date", { ascending: true });
  if (error) throw error;

  // Collect unique user_ids from bookings
  const userIds = [...new Set(bookings.map((b: any) => b.user_id))];

  // Fetch matching profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", userIds);

  // Build a lookup map and attach profile to each booking
  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p]));
  return bookings.map((b: any) => ({
    ...b,
    profiles: profileMap.get(b.user_id) || null,
  }));
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
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
