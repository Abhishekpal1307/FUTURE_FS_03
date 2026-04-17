import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Urban Brew Café" },
      { name: "description", content: "Explore our handcrafted coffee, fresh pastries, and delicious snacks at Urban Brew Café." },
      { property: "og:title", content: "Menu — Urban Brew Café" },
      { property: "og:description", content: "Handcrafted coffee, fresh pastries, and delicious snacks." },
    ],
  }),
  component: MenuPage,
});

const categories = ["All", "Coffee", "Snacks", "Desserts"] as const;

// Prices stored in USD; INR computed at fixed rate
const USD_TO_INR = 83;

const menuItems = [
  { name: "Classic Espresso", price: 3.5, category: "Coffee", desc: "Bold and rich single-origin shot." },
  { name: "Caramel Latte", price: 5.5, category: "Coffee", desc: "Velvety steamed milk with caramel drizzle." },
  { name: "Cold Brew", price: 4.5, category: "Coffee", desc: "Slow-steeped for 20 hours, silky smooth." },
  { name: "Matcha Latte", price: 5.0, category: "Coffee", desc: "Ceremonial-grade matcha with oat milk." },
  { name: "Cappuccino", price: 4.5, category: "Coffee", desc: "Perfect foam-to-espresso ratio." },
  { name: "Masala Chai", price: 3.0, category: "Coffee", desc: "Aromatic Indian spiced tea with milk." },
  { name: "Filter Coffee", price: 3.5, category: "Coffee", desc: "South Indian style strong filter coffee." },
  { name: "Mocha", price: 5.5, category: "Coffee", desc: "Espresso with chocolate and steamed milk." },
  { name: "Hazelnut Cold Coffee", price: 5.0, category: "Coffee", desc: "Iced espresso blended with hazelnut syrup." },
  { name: "Butter Croissant", price: 3.5, category: "Snacks", desc: "Flaky, golden, baked fresh every morning." },
  { name: "Avocado Toast", price: 8.0, category: "Snacks", desc: "Sourdough, smashed avo, chili flakes." },
  { name: "Granola Bowl", price: 7.0, category: "Snacks", desc: "House granola, Greek yogurt, seasonal fruit." },
  { name: "Paneer Sandwich", price: 6.5, category: "Snacks", desc: "Grilled paneer, mint chutney, sourdough." },
  { name: "Veg Wrap", price: 6.0, category: "Snacks", desc: "Hummus, grilled veggies, herbed yogurt." },
  { name: "Chicken Panini", price: 8.5, category: "Snacks", desc: "Grilled chicken, pesto, mozzarella." },
  { name: "Chocolate Cake", price: 6.0, category: "Desserts", desc: "Rich Belgian chocolate layered cake." },
  { name: "Tiramisu", price: 6.5, category: "Desserts", desc: "Classic Italian with espresso-soaked ladyfingers." },
  { name: "Cheesecake", price: 6.0, category: "Desserts", desc: "New York style with berry compote." },
  { name: "Blueberry Muffin", price: 3.5, category: "Desserts", desc: "Bursting with wild blueberries." },
  { name: "Brownie à la Mode", price: 5.5, category: "Desserts", desc: "Warm fudge brownie with vanilla ice cream." },
  { name: "Gulab Jamun Cheesecake", price: 6.5, category: "Desserts", desc: "Indo-fusion fan favourite." },
];

function formatPrice(usd: number, currency: "USD" | "INR") {
  if (currency === "USD") return `$${usd.toFixed(2)}`;
  return `₹${Math.round(usd * USD_TO_INR)}`;
}

function MenuPage() {
  const [active, setActive] = useState<string>("All");
  const [currency, setCurrency] = useState<"USD" | "INR">("INR");
  const filtered = active === "All" ? menuItems : menuItems.filter((i) => i.category === active);

  return (
    <div className="pt-24">
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Offerings</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">The Menu</h1>
            <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto">
              Every item is prepared fresh with premium ingredients.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          {/* Currency toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 rounded-full bg-muted">
              {(["INR", "USD"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    currency === c
                      ? "bg-accent text-accent-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "INR" ? "₹ INR" : "$ USD"}
                </button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="font-heading font-semibold text-foreground">{item.name}</h3>
                  <span className="text-accent font-bold text-lg whitespace-nowrap">{formatPrice(item.price, currency)}</span>
                </div>
                <span className="text-xs text-accent/80 uppercase tracking-wider">{item.category}</span>
                <p className="mt-2 text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
