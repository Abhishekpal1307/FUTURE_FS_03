import { Link } from "@tanstack/react-router";
import { Coffee, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-narrow px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-6 h-6 text-accent" />
              <span className="font-heading text-lg font-bold">Urban Brew</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Crafting exceptional coffee experiences since 2018. Every cup tells a story.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/" as const, label: "Home" },
                { to: "/about" as const, label: "About" },
                { to: "/menu" as const, label: "Menu" },
                { to: "/gallery" as const, label: "Gallery" },
                { to: "/contact" as const, label: "Contact" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">Hours</h4>
            <div className="text-sm text-primary-foreground/60 space-y-2">
              <p>Mon – Fri: 7:00 AM – 9:00 PM</p>
              <p>Saturday: 8:00 AM – 10:00 PM</p>
              <p>Sunday: 8:00 AM – 8:00 PM</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-accent">Contact</h4>
            <div className="text-sm text-primary-foreground/60 space-y-3">
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-accent shrink-0" /> 123 Brew Street, Downtown, NY 10001</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent shrink-0" /> +91 9555349309</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent shrink-0" /> abhi130703@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Urban Brew Café. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
