import { createServerFn } from "@tanstack/react-start";

export const getContactSubmissions = createServerFn({ method: "GET" })
  .handler(async () => {
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    // Use service role key if available (bypasses RLS), otherwise fall back to anon key
    const key = serviceKey || anonKey;
    if (!supabaseUrl || !key) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch submissions");
    return data ?? [];
  });

export const getTableBookings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const key = serviceKey || anonKey;
    if (!supabaseUrl || !key) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, key);
    const { data, error } = await supabase
      .from("table_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch bookings");
    return data ?? [];
  });
