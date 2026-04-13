import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ArrowRight, Star, Clock, Coffee } from "lucide-react";
import heroImage from "@/assets/hero-cafe.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urban Brew Café — Artisan Coffee & Cozy Vibes" },
      { name: "description", content: "Discover Urban Brew Café — handcrafted coffee, fresh pastries, and a warm atmosphere in the heart of downtown." },
      { property: "og:title", content: "Urban Brew Café — Artisan Coffee & Cozy Vibes" },
      { property: "og:description", content: "Handcrafted coffee, fresh pastries, and a warm atmosphere in the heart of downtown." },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  { name: "Sarah M.", text: "Best latte in the city! The atmosphere is so cozy and welcoming.", rating: 5 },
  { name: "James L.", text: "My go-to spot for morning coffee. The pastries are to die for.", rating: 5 },
  { name: "Emily K.", text: "Love the vibe here. Perfect for working or catching up with friends.", rating: 5 },
];

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Urban Brew Café interior" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-primary/70" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-sm font-medium mb-6">
              ☕ Freshly Brewed Daily
            </span>
          </motion.div>
          <motion.h1
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Where Every Cup{" "}
            <span className="text-accent">Tells a Story</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Handcrafted artisan coffee, fresh pastries, and a warm atmosphere — right in the heart of downtown.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/menu"
              className="px-8 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition flex items-center justify-center gap-2"
            >
              View Menu <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition"
            >
              Visit Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Why Urban Brew?</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">More than just coffee — it's an experience crafted with passion.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Coffee, title: "Premium Beans", desc: "Ethically sourced from the world's finest coffee-growing regions." },
              { icon: Clock, title: "Open Early", desc: "Doors open at 7 AM so you never miss your morning ritual." },
              { icon: Star, title: "Award Winning", desc: "Voted Best Café 2024 by Downtown Coffee Awards." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center group hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={gallery3} alt="Café atmosphere" className="w-full h-80 lg:h-[28rem] object-cover" loading="lazy" width={800} height={800} />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2 mb-4">Brewing Happiness Since 2018</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                What started as a small corner shop has grown into Downtown's favorite coffee destination. We believe every cup should be a moment of joy — from the first aroma to the last sip.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="glass-card-dark p-6 rounded-2xl">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <p className="font-semibold text-accent text-sm">{t.name}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-accent-foreground">Ready to Taste the Difference?</h2>
            <p className="mt-3 text-accent-foreground/70 max-w-md mx-auto">Visit us today or reserve your table for a perfect coffee experience.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu" className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:brightness-110 transition">
                Explore Menu
              </Link>
              <Link to="/contact" className="px-8 py-3.5 rounded-xl border-2 border-accent-foreground/30 text-accent-foreground font-semibold hover:bg-accent-foreground/10 transition">
                Contact Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
