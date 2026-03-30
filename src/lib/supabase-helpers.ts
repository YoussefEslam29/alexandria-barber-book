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
  const { data, error } = await supabase
    .from("bookings")
    .select("*, services(*), profiles!bookings_user_id_fkey(*)")
    .order("booking_date", { ascending: true });
  if (error) throw error;
  return data;
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
