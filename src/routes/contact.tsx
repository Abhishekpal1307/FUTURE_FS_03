import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { MapPin, Phone, Mail, Clock, Send, Calendar, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { submitContactForm, submitTableBooking } from "@/utils/notifications.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Urban Brew Café" },
      { name: "description", content: "Get in touch with Urban Brew Café. Find our location, hours, and send us a message." },
      { property: "og:title", content: "Contact — Urban Brew Café" },
      { property: "og:description", content: "Find our location, hours, and send us a message." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [tab, setTab] = useState<"contact" | "booking">("contact");

  return (
    <div className="pt-24">
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">Contact Us</h1>
            <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto">
              We'd love to hear from you. Drop us a line or book a table.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Forms */}
            <AnimatedSection direction="left">
              {/* Tab switcher */}
              <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
                <button
                  onClick={() => setTab("contact")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === "contact" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Send Message
                </button>
                <button
                  onClick={() => setTab("booking")}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === "booking" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Book a Table
                </button>
              </div>

              {tab === "contact" ? <ContactForm /> : <BookingForm />}
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection direction="right">
              <h2 className="font-heading text-2xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-5 mb-8">
                {[
                  { icon: MapPin, label: "Address", value: "12 Lodhi Road, Near Lodhi Garden, New Delhi 110003, India" },
                  { icon: Phone, label: "Phone", value: "+91 9555349309" },
                  { icon: Mail, label: "Email", value: "abhi130703@gmail.com" },
                  { icon: Clock, label: "Hours", value: "Mon-Fri 7AM-9PM · Sat 8AM-10PM · Sun 8AM-8PM" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-muted-foreground text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  title="Urban Brew Café Location"
                  src="https://www.google.com/maps?q=Lodhi+Garden,+New+Delhi,+India&output=embed"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactForm({
        data: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          message: formData.get("message") as string,
        },
      });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-accent" />
        </div>
        <h3 className="font-heading text-lg font-semibold">Message Sent!</h3>
        <p className="text-muted-foreground text-sm mt-1">We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Name</label>
        <input name="name" type="text" required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Email</label>
        <input name="email" type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Message</label>
        <textarea name="message" required rows={5} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none" />
      </div>
      <button type="submit" disabled={loading} className="w-full px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? "Sending..." : "Send Message"} {!loading && <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}

function BookingForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitTableBooking({
        data: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          phone: (formData.get("phone") as string) || undefined,
          booking_date: formData.get("date") as string,
          booking_time: formData.get("time") as string,
          guests: parseInt(formData.get("guests") as string, 10),
          message: (formData.get("message") as string) || undefined,
        },
      });
      setSubmitted(true);
      toast.success("Table booked! We'll confirm your reservation soon.");
      form.reset();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-7 h-7 text-accent" />
        </div>
        <h3 className="font-heading text-lg font-semibold">Table Booked!</h3>
        <p className="text-muted-foreground text-sm mt-1">We'll confirm your reservation shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input name="name" type="text" required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input name="email" type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <input name="phone" type="tel" placeholder="+91 9555349309" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Guests</label>
          <select name="guests" required defaultValue="2" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition">
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Date</label>
          <input name="date" type="date" required min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Time</label>
          <select name="time" required defaultValue="" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition">
            <option value="" disabled>Select time</option>
            {["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Special Requests</label>
        <textarea name="message" rows={3} placeholder="Any special requests?" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none" />
      </div>
      <button type="submit" disabled={loading} className="w-full px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? "Booking..." : "Book Table"} {!loading && <Calendar className="w-4 h-4" />}
      </button>
    </form>
  );
}
