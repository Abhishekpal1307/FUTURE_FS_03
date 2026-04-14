import { createServerFn } from "@tanstack/react-start";

export const getContactSubmissions = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch submissions");
    return data ?? [];
  });

export const getTableBookings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("table_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch bookings");
    return data ?? [];
  });
