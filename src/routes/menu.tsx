import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState } from "react";
import { motion } from "framer-motion";
import imgEspresso from "@/assets/menu/espresso.jpg";
import imgCaramelLatte from "@/assets/menu/caramel-latte.jpg";
import imgColdBrew from "@/assets/menu/cold-brew.jpg";
import imgMatcha from "@/assets/menu/matcha-latte.jpg";
import imgCappuccino from "@/assets/menu/cappuccino.jpg";
import imgMasalaChai from "@/assets/menu/masala-chai.jpg";
import imgFilterCoffee from "@/assets/menu/filter-coffee.jpg";
import imgMocha from "@/assets/menu/mocha.jpg";
import imgHazelnut from "@/assets/menu/hazelnut-cold-coffee.jpg";
import imgCroissant from "@/assets/menu/croissant.jpg";
import imgAvocadoToast from "@/assets/menu/avocado-toast.jpg";
import imgGranola from "@/assets/menu/granola-bowl.jpg";
import imgPaneerSandwich from "@/assets/menu/paneer-sandwich.jpg";
import imgVegWrap from "@/assets/menu/veg-wrap.jpg";
import imgChickenPanini from "@/assets/menu/chicken-panini.jpg";
import imgChocolateCake from "@/assets/menu/chocolate-cake.jpg";
import imgTiramisu from "@/assets/menu/tiramisu.jpg";
import imgCheesecake from "@/assets/menu/cheesecake.jpg";
import imgBlueberryMuffin from "@/assets/menu/blueberry-muffin.jpg";
import imgBrownie from "@/assets/menu/brownie.jpg";
import imgGulabJamunCheesecake from "@/assets/menu/gulab-jamun-cheesecake.jpg";

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
  { name: "Classic Espresso", price: 3.5, category: "Coffee", desc: "Bold and rich single-origin shot.", img: imgEspresso },
  { name: "Caramel Latte", price: 5.5, category: "Coffee", desc: "Velvety steamed milk with caramel drizzle.", img: imgCaramelLatte },
  { name: "Cold Brew", price: 4.5, category: "Coffee", desc: "Slow-steeped for 20 hours, silky smooth.", img: imgColdBrew },
  { name: "Matcha Latte", price: 5.0, category: "Coffee", desc: "Ceremonial-grade matcha with oat milk.", img: imgMatcha },
  { name: "Cappuccino", price: 4.5, category: "Coffee", desc: "Perfect foam-to-espresso ratio.", img: imgCappuccino },
  { name: "Masala Chai", price: 3.0, category: "Coffee", desc: "Aromatic Indian spiced tea with milk.", img: imgMasalaChai },
  { name: "Filter Coffee", price: 3.5, category: "Coffee", desc: "South Indian style strong filter coffee.", img: imgFilterCoffee },
  { name: "Mocha", price: 5.5, category: "Coffee", desc: "Espresso with chocolate and steamed milk.", img: imgMocha },
  { name: "Hazelnut Cold Coffee", price: 5.0, category: "Coffee", desc: "Iced espresso blended with hazelnut syrup.", img: imgHazelnut },
  { name: "Butter Croissant", price: 3.5, category: "Snacks", desc: "Flaky, golden, baked fresh every morning.", img: imgCroissant },
  { name: "Avocado Toast", price: 8.0, category: "Snacks", desc: "Sourdough, smashed avo, chili flakes.", img: imgAvocadoToast },
  { name: "Granola Bowl", price: 7.0, category: "Snacks", desc: "House granola, Greek yogurt, seasonal fruit.", img: imgGranola },
  { name: "Paneer Sandwich", price: 6.5, category: "Snacks", desc: "Grilled paneer, mint chutney, sourdough.", img: imgPaneerSandwich },
  { name: "Veg Wrap", price: 6.0, category: "Snacks", desc: "Hummus, grilled veggies, herbed yogurt.", img: imgVegWrap },
  { name: "Chicken Panini", price: 8.5, category: "Snacks", desc: "Grilled chicken, pesto, mozzarella.", img: imgChickenPanini },
  { name: "Chocolate Cake", price: 6.0, category: "Desserts", desc: "Rich Belgian chocolate layered cake.", img: imgChocolateCake },
  { name: "Tiramisu", price: 6.5, category: "Desserts", desc: "Classic Italian with espresso-soaked ladyfingers.", img: imgTiramisu },
  { name: "Cheesecake", price: 6.0, category: "Desserts", desc: "New York style with berry compote.", img: imgCheesecake },
  { name: "Blueberry Muffin", price: 3.5, category: "Desserts", desc: "Bursting with wild blueberries.", img: imgBlueberryMuffin },
  { name: "Brownie à la Mode", price: 5.5, category: "Desserts", desc: "Warm fudge brownie with vanilla ice cream.", img: imgBrownie },
  { name: "Gulab Jamun Cheesecake", price: 6.5, category: "Desserts", desc: "Indo-fusion fan favourite.", img: imgGulabJamunCheesecake },
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
                className="glass-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    width={640}
                    height={480}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/80 text-primary-foreground uppercase tracking-wider backdrop-blur-sm">
                    {item.category}
                  </span>
                  <span className="absolute top-3 right-3 text-sm font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground shadow">
                    {formatPrice(item.price, currency)}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-foreground">{item.name}</h3>
                  <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
