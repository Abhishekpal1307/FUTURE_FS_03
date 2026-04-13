import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="pt-24">
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Get in Touch</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">Contact Us</h1>
            <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto">
              We'd love to hear from you. Drop us a line or stop by.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection direction="left">
              <h2 className="font-heading text-2xl font-bold mb-6">Send a Message</h2>
              {submitted ? (
                <div className="glass-card p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm mt-1">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name</label>
                    <input type="text" required placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Message</label>
                    <textarea required rows={5} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-none" />
                  </div>
                  <button type="submit" className="w-full px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition flex items-center justify-center gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection direction="right">
              <h2 className="font-heading text-2xl font-bold mb-6">Visit Us</h2>
              <div className="space-y-5 mb-8">
                {[
                  { icon: MapPin, label: "Address", value: "123 Brew Street, Downtown, NY 10001" },
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

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  title="Urban Brew Café Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1620120000000"
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
