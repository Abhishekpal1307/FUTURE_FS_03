import { Link, useLocation } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Coffee, Menu, X, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/" as const, label: "Home" },
  { to: "/about" as const, label: "About" },
  { to: "/menu" as const, label: "Menu" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/contact" as const, label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { scrollY } = useScroll();
  const isHome = location.pathname === "/";
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    isHome ? ["rgba(30,41,59,0)", "rgba(30,41,59,0.97)"] : ["rgba(30,41,59,0.97)", "rgba(30,41,59,0.97)"]
  );
  const headerPy = useTransform(scrollY, [0, 100], ["1.25rem", "0.75rem"]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: headerBg, paddingTop: headerPy, paddingBottom: headerPy }}
    >
      <div className="container-narrow flex items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Coffee className="w-7 h-7 text-accent transition-transform group-hover:rotate-12" />
          <span className="font-heading text-xl font-bold text-primary-foreground tracking-tight">
            Urban Brew
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="relative px-4 py-2 text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors"
              activeProps={{ className: "text-accent" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-3 px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition"
          >
            Book a Table
          </Link>
          <Link
            to="/admin"
            className="ml-2 p-2 rounded-lg text-primary-foreground/40 hover:text-accent hover:bg-primary-foreground/5 transition"
            title="Admin Portal"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </nav>

        <button
          className="md:hidden text-primary-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="px-4 py-3 text-primary-foreground/80 hover:text-accent transition-colors rounded-lg hover:bg-primary-foreground/5"
              activeProps={{ className: "text-accent bg-primary-foreground/5" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="mt-2 px-5 py-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold text-center"
          >
            Book a Table
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-3 text-primary-foreground/50 hover:text-accent transition-colors rounded-lg hover:bg-primary-foreground/5 text-sm"
          >
            <Shield className="w-4 h-4" /> Admin
          </Link>
        </nav>
      </motion.div>
    </motion.header>
  );
}
