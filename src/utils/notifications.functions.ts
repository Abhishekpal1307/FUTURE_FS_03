import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OWNER_EMAIL = "abhi130703@gmail.com";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
});

const bookingSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(20).optional(),
  booking_date: z.string().min(1),
  booking_time: z.string().min(1),
  guests: z.number().min(1).max(20),
  message: z.string().max(2000).optional(),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof contactSchema>) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (error) throw new Error("Failed to save submission");

    // Send notification email via Edge Function
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: OWNER_EMAIL,
          subject: `New Contact Form: ${data.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            <p><em>Received at ${new Date().toLocaleString()}</em></p>
          `,
        }),
      });
    } catch (e) {
      console.error("Notification email failed:", e);
    }

    return { success: true };
  });

export const submitTableBooking = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof bookingSchema>) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("table_bookings").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      guests: data.guests,
      message: data.message || null,
    });

    if (error) throw new Error("Failed to save booking");

    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: OWNER_EMAIL,
          subject: `New Table Booking: ${data.name}`,
          html: `
            <h2>New Table Booking</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Date:</strong> ${data.booking_date}</p>
            <p><strong>Time:</strong> ${data.booking_time}</p>
            <p><strong>Guests:</strong> ${data.guests}</p>
            <p><strong>Special Requests:</strong> ${data.message || "None"}</p>
            <p><em>Received at ${new Date().toLocaleString()}</em></p>
          `,
        }),
      });
    } catch (e) {
      console.error("Notification email failed:", e);
    }

    // Send confirmation email to the customer
    try {
      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: data.email,
          subject: `Booking Received — Urban Brew Café`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #F59E0B, #d97706); padding: 28px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 26px;">Urban Brew Café</h1>
                <p style="color: #fff7ed; margin: 8px 0 0; font-size: 14px;">Near Lodhi Garden, Delhi</p>
              </div>
              <div style="padding: 28px; color: #1E293B;">
                <h2 style="margin: 0 0 12px; color: #1E293B;">Hi ${data.name}, thanks for your booking!</h2>
                <p style="color: #475569; line-height: 1.6;">
                  We've received your reservation request and will confirm it shortly. Here are your booking details:
                </p>
                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 6px 0; color: #1E293B;"><strong>Date:</strong> ${data.booking_date}</p>
                  <p style="margin: 6px 0; color: #1E293B;"><strong>Time:</strong> ${data.booking_time}</p>
                  <p style="margin: 6px 0; color: #1E293B;"><strong>Guests:</strong> ${data.guests}</p>
                  ${data.phone ? `<p style="margin: 6px 0; color: #1E293B;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
                  ${data.message ? `<p style="margin: 6px 0; color: #1E293B;"><strong>Special Requests:</strong> ${data.message}</p>` : ""}
                </div>
                <p style="color: #475569; line-height: 1.6;">
                  You'll receive another email as soon as your table is confirmed. For any changes, call us at
                  <a href="tel:+919555349309" style="color: #F59E0B; text-decoration: none;"><strong>+91 9555349309</strong></a>.
                </p>
                <p style="color: #475569; margin-top: 24px;">See you soon,<br/><strong>The Urban Brew Team</strong></p>
              </div>
              <div style="background: #1E293B; padding: 16px; text-align: center; border-radius: 0 0 12px 12px;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">Urban Brew Café · Near Lodhi Garden, Delhi · India</p>
              </div>
            </div>
          `,
        }),
      });
    } catch (e) {
      console.error("Customer confirmation email failed:", e);
    }

    return { success: true };
  });
