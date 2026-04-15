import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getContactSubmissions, getTableBookings } from "@/utils/admin.functions";
import {
  Mail, Calendar, Users, MessageSquare, Clock, Phone,
  Shield, ChevronDown, ChevronUp, Search, RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Urban Brew Café" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const ADMIN_PASSWORD = "Abhi@123";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface TableBooking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  booking_date: string;
  booking_time: string;
  guests: number;
  message: string | null;
  created_at: string;
}

function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-secondary">
        <AnimatedSection>
          <div className="glass-card p-8 w-full max-w-sm mx-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-accent" />
              <h1 className="font-heading text-xl font-bold">Admin Access</h1>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <button type="submit" className="w-full px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition">
                Login
              </button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const [tab, setTab] = useState<"contacts" | "bookings">("contacts");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [bookings, setBookings] = useState<TableBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, b] = await Promise.all([
        getContactSubmissions(),
        getTableBookings(),
      ]);
      setContacts(c as ContactSubmission[]);
      setBookings(b as TableBooking[]);
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredContacts = contacts.filter((c) =>
    [c.name, c.email, c.message].some((v) => v.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredBookings = bookings.filter((b) =>
    [b.name, b.email, b.phone, b.message].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="pt-24 min-h-screen bg-secondary">
      <div className="container-narrow px-4 md:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage submissions and bookings</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:brightness-110 transition disabled:opacity-60">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: MessageSquare, label: "Messages", value: contacts.length, color: "text-blue-500" },
            { icon: Calendar, label: "Bookings", value: bookings.length, color: "text-accent" },
            { icon: Users, label: "Today's Bookings", value: bookings.filter((b) => b.booking_date === new Date().toISOString().split("T")[0]).length, color: "text-green-500" },
            { icon: Clock, label: "Last 24h", value: contacts.filter((c) => new Date(c.created_at) > new Date(Date.now() - 86400000)).length + bookings.filter((b) => new Date(b.created_at) > new Date(Date.now() - 86400000)).length, color: "text-orange-500" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold font-heading">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-muted rounded-xl p-1 flex-shrink-0">
            <button
              onClick={() => setTab("contacts")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "contacts" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Messages ({contacts.length})
            </button>
            <button
              onClick={() => setTab("bookings")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "bookings" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Bookings ({bookings.length})
            </button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition text-sm"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : tab === "contacts" ? (
          <ContactList contacts={filteredContacts} />
        ) : (
          <BookingList bookings={filteredBookings} />
        )}
      </div>
    </div>
  );
}

function ContactList({ contacts }: { contacts: ContactSubmission[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (contacts.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Mail className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">No contact submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="glass-card overflow-hidden"
        >
          <button
            onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            className="w-full p-4 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              {expanded === c.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </button>
          {expanded === c.id && (
            <div className="px-4 pb-4 pt-0 border-t border-border">
              <p className="text-sm text-foreground/80 whitespace-pre-wrap mt-3">{c.message}</p>
              <div className="mt-3 flex gap-2">
                <a href={`mailto:${c.email}`} className="text-xs px-3 py-1.5 rounded-lg bg-accent text-accent-foreground font-medium hover:brightness-110 transition">
                  Reply via Email
                </a>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function BookingList({ bookings }: { bookings: TableBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground">No table bookings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((b, i) => {
        const bookingDate = new Date(b.booking_date + "T00:00:00");
        const isPast = bookingDate < new Date(new Date().toDateString());
        const isToday = b.booking_date === new Date().toISOString().split("T")[0];

        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`glass-card p-4 ${isPast ? "opacity-60" : ""}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isToday ? "bg-green-100 text-green-600" : "bg-accent/10 text-accent"}`}>
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{b.name}</p>
                    {isToday && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">TODAY</span>}
                    {isPast && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">PAST</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{b.email}{b.phone ? ` · ${b.phone}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pl-12 sm:pl-0">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {bookingDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.booking_time}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {b.guests}</span>
              </div>
            </div>
            {b.message && (
              <p className="text-xs text-muted-foreground mt-2 pl-12">💬 {b.message}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
