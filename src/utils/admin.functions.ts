import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function getSupabaseClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const key = serviceKey || anonKey;
  if (!supabaseUrl || !key) throw new Error("Missing Supabase configuration");
  return { supabase: createClient(supabaseUrl, key), supabaseUrl, anonKey };
}

export const getContactSubmissions = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabase } = await getSupabaseClient();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch submissions");
    return data ?? [];
  });

export const getTableBookings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabase } = await getSupabaseClient();
    const { data, error } = await supabase
      .from("table_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Failed to fetch bookings");
    return data ?? [];
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; status: string }) => {
    const schema = z.object({
      id: z.string().uuid(),
      status: z.enum(["approved", "rejected"]),
    });
    return schema.parse(input);
  })
  .handler(async ({ data }) => {
    const { supabase, supabaseUrl, anonKey } = await getSupabaseClient();

    // Get booking details first
    const { data: booking, error: fetchError } = await supabase
      .from("table_bookings")
      .select("*")
      .eq("id", data.id)
      .single();

    if (fetchError || !booking) throw new Error("Booking not found");

    // Update status
    const { error: updateError } = await supabase
      .from("table_bookings")
      .update({ status: data.status })
      .eq("id", data.id);

    if (updateError) throw new Error("Failed to update booking status");

    // Send email notification to customer
    const statusText = data.status === "approved" ? "Approved ✅" : "Rejected ❌";
    const statusMessage = data.status === "approved"
      ? `We are pleased to confirm your table booking at Urban Brew Café! We look forward to seeing you on ${booking.booking_date} at ${booking.booking_time}.`
      : `Unfortunately, we are unable to accommodate your booking request for ${booking.booking_date} at ${booking.booking_time}. Please contact us to discuss alternative arrangements.`;

    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          to: booking.email,
          subject: `Booking ${statusText} — Urban Brew Café`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:20px;">
              <h2 style="color:#1E293B;">Booking ${statusText}</h2>
              <p>Dear ${booking.name},</p>
              <p>${statusMessage}</p>
              <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
                <p style="margin:4px 0;"><strong>Date:</strong> ${booking.booking_date}</p>
                <p style="margin:4px 0;"><strong>Time:</strong> ${booking.booking_time}</p>
                <p style="margin:4px 0;"><strong>Guests:</strong> ${booking.guests}</p>
              </div>
              <p style="color:#64748b;font-size:12px;">Urban Brew Café<br>📞 +91 9555349309</p>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.error("Customer email notification failed:", e);
    }

    // Send SMS if phone is available and Twilio is configured
    try {
      const twilioApiKey = process.env.TWILIO_API_KEY;
      const lovableApiKey = process.env.LOVABLE_API_KEY;
      if (twilioApiKey && lovableApiKey && booking.phone) {
        const smsBody = data.status === "approved"
          ? `Hi ${booking.name}! Your booking at Urban Brew Café on ${booking.booking_date} at ${booking.booking_time} for ${booking.guests} guest(s) is CONFIRMED. See you soon!`
          : `Hi ${booking.name}, we regret that your booking at Urban Brew Café on ${booking.booking_date} at ${booking.booking_time} could not be accommodated. Please contact us at +91 9555349309 for alternatives.`;

        await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "X-Connection-Api-Key": twilioApiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: booking.phone,
            From: process.env.TWILIO_PHONE_NUMBER || "+15005550006",
            Body: smsBody,
          }),
        });
      }
    } catch (e) {
      console.error("SMS notification failed:", e);
    }

    return { success: true, status: data.status };
  });
