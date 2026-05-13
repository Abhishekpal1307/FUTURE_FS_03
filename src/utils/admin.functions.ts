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
    const isApproved = data.status === "approved";
    const subject = isApproved
      ? `🎉 Welcome to Urban Brew — Your Table is Confirmed!`
      : `Update on Your Booking — Urban Brew Café`;

    const html = isApproved ? `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:linear-gradient(135deg,#1E293B,#334155);padding:32px 24px;text-align:center;">
          <h1 style="color:#F59E0B;margin:0;font-size:26px;">Urban Brew Café</h1>
          <p style="color:#e2e8f0;margin:8px 0 0;font-size:14px;">Welcome to the family ☕</p>
        </div>
        <div style="padding:28px 24px;">
          <h2 style="color:#1E293B;margin:0 0 12px;">Hi ${booking.name}, your booking is accepted! ✅</h2>
          <p style="color:#475569;line-height:1.6;">
            We're delighted to welcome you to Urban Brew Café. Your table has been confirmed
            and our team is already looking forward to crafting a memorable experience for you.
          </p>
          <div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:4px 0;color:#1E293B;"><strong>📅 Date:</strong> ${booking.booking_date}</p>
            <p style="margin:4px 0;color:#1E293B;"><strong>⏰ Time:</strong> ${booking.booking_time}</p>
            <p style="margin:4px 0;color:#1E293B;"><strong>👥 Guests:</strong> ${booking.guests}</p>
          </div>
          <p style="color:#475569;line-height:1.6;">
            📍 12 Lodhi Road, Near Lodhi Garden, New Delhi<br/>
            Need to make changes? Just reply to this email or call us.
          </p>
          <p style="color:#1E293B;margin-top:24px;">See you soon,<br/><strong>The Urban Brew Team</strong></p>
        </div>
        <div style="background:#f8fafc;padding:16px;text-align:center;color:#64748b;font-size:12px;">
          Urban Brew Café · 📞 +91 9555349309
        </div>
      </div>
    ` : `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;">
        <div style="background:#1E293B;padding:28px 24px;text-align:center;">
          <h1 style="color:#F59E0B;margin:0;font-size:24px;">Urban Brew Café</h1>
        </div>
        <div style="padding:28px 24px;">
          <h2 style="color:#1E293B;margin:0 0 12px;">Hi ${booking.name},</h2>
          <p style="color:#475569;line-height:1.6;">
            Thank you for choosing Urban Brew Café. Unfortunately, we're unable to accommodate
            your booking for <strong>${booking.booking_date} at ${booking.booking_time}</strong>
            at this time — we're fully booked or temporarily unavailable.
          </p>
          <p style="color:#475569;line-height:1.6;">
            We'd love to host you on another date. Please call us at
            <strong>+91 9555349309</strong> and we'll find the perfect slot for you.
          </p>
          <p style="color:#1E293B;margin-top:24px;">With apologies,<br/><strong>The Urban Brew Team</strong></p>
        </div>
        <div style="background:#f8fafc;padding:16px;text-align:center;color:#64748b;font-size:12px;">
          Urban Brew Café · 📞 +91 9555349309
        </div>
      </div>
    `;

    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify({ to: booking.email, subject, html }),
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
