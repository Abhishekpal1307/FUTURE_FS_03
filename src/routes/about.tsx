import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Heart, Leaf, Users } from "lucide-react";
import aboutImage from "@/assets/about-cafe.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Urban Brew Café" },
      { name: "description", content: "Learn the story behind Urban Brew Café — our mission, values, and passion for exceptional coffee." },
      { property: "og:title", content: "About — Urban Brew Café" },
      { property: "og:description", content: "Our mission, values, and passion for exceptional coffee." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Story</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">About Urban Brew</h1>
            <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto">
              A passion project that became Downtown's beloved coffee destination.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <img src={aboutImage} alt="Coffee and pastries" className="rounded-3xl shadow-2xl w-full h-80 lg:h-96 object-cover" loading="lazy" width={1280} height={720} />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <h2 className="font-heading text-3xl font-bold mb-4">From a Dream to a Cup</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In 2018, two coffee-obsessed friends decided to create a space where quality, community, and comfort come together. What started in a tiny 400 sq ft space has grown into a thriving café that serves over 500 cups daily.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We source our beans directly from sustainable farms across Colombia, Ethiopia, and Guatemala. Every roast is crafted in small batches to ensure maximum freshness and flavor.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow px-4 md:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Our Values</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Passion First", desc: "Every cup is brewed with genuine love for the craft. We never cut corners." },
              { icon: Leaf, title: "Sustainability", desc: "From compostable cups to fair-trade beans, we care for our planet." },
              { icon: Users, title: "Community", desc: "More than a café — we're a gathering place for connection and creativity." },
            ].map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center group hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                    <v.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
