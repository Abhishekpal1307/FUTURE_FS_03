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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    if (error) throw new Error("Failed to save submission");

    // Send notification email via Supabase Edge Function or simple fetch
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (SUPABASE_URL && SERVICE_KEY) {
        await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_KEY}`,
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
      }
    } catch (e) {
      console.error("Notification email failed:", e);
    }

    return { success: true };
  });

export const submitTableBooking = createServerFn({ method: "POST" })
  .inputValidator((input: z.infer<typeof bookingSchema>) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("table_bookings").insert({
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
      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (SUPABASE_URL && SERVICE_KEY) {
        await fetch(`${SUPABASE_URL}/functions/v1/send-notification`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_KEY}`,
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
      }
    } catch (e) {
      console.error("Notification email failed:", e);
    }

    return { success: true };
  });
