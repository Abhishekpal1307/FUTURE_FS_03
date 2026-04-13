import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Urban Brew Café" },
      { name: "description", content: "Browse photos of our café, signature drinks, and freshly baked treats." },
      { property: "og:title", content: "Gallery — Urban Brew Café" },
      { property: "og:description", content: "Photos of our café, signature drinks, and freshly baked treats." },
    ],
  }),
  component: GalleryPage,
});

const images = [
  { src: gallery1, alt: "Fresh espresso pour" },
  { src: gallery2, alt: "Artisan croissants" },
  { src: gallery3, alt: "Café atmosphere" },
  { src: gallery4, alt: "Iced coffee drinks" },
  { src: gallery5, alt: "Barista making latte art" },
  { src: gallery6, alt: "Desserts" },
];

function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="pt-24">
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-narrow px-4 md:px-8 text-center">
          <AnimatedSection>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Snapshots</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mt-2">Our Gallery</h1>
            <p className="mt-4 text-primary-foreground/60 max-w-xl mx-auto">
              A peek into the Urban Brew experience.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <motion.div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelected(i)}
                >
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" width={800} height={800} />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">View</span>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.img
              src={images[selected].src}
              alt={images[selected].alt}
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
