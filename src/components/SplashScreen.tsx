import { motion, AnimatePresence } from "framer-motion";
import { Coffee } from "lucide-react";
import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"loading" | "exiting">("loading");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("exiting"), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "exiting") {
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exiting" ? null : undefined}
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary"
        initial={{ opacity: 1 }}
        animate={phase === "exiting" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Coffee icon with steam animation */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <div className="relative">
            {/* Steam particles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute -top-4 rounded-full bg-accent/40"
                style={{
                  width: 4,
                  height: 4,
                  left: `${12 + i * 10}px`,
                }}
                animate={{
                  y: [-8, -28],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1.2],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
            <Coffee className="w-12 h-12 text-accent" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          className="font-heading text-3xl font-bold text-primary-foreground tracking-tight"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Urban Brew
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-primary-foreground/50 text-sm mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Crafting moments, one cup at a time
        </motion.p>

        {/* Progress bar */}
        <motion.div
          className="mt-8 w-40 h-0.5 bg-primary-foreground/10 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
