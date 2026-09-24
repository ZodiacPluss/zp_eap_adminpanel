import {
  AlertTriangle, DollarSign, UserPlus, Rocket, Activity, CheckCircle
} from "lucide-react";
// Accent colours are referenced by palette key (`tone`) and resolved at render
// time from the active theme — see `usePalette()`.

// ─── Static databases ─────────────────────────────────────────────────────────
export const monthlyGrowth = [
  { m: "Aug", c: 18200, e: 820, eap: 2100 }, { m: "Sep", c: 19400, e: 890, eap: 2400 },
  { m: "Oct", c: 20100, e: 940, eap: 2800 }, { m: "Nov", c: 21300, e: 1010, eap: 3100 },
  { m: "Dec", c: 20800, e: 980, eap: 3000 }, { m: "Jan", c: 22100, e: 1080, eap: 3400 },
  { m: "Feb", c: 23400, e: 1130, eap: 3700 }, { m: "Mar", c: 22900, e: 1110, eap: 3600 },
  { m: "Apr", c: 23800, e: 1160, eap: 3900 }, { m: "May", c: 24200, e: 1200, eap: 4100 },
  { m: "Jun", c: 24700, e: 1230, eap: 4300 }, { m: "Jul", c: 24891, e: 1247, eap: 4520 },
];

export const weekSessions = [
  { d: "Mon", total: 3420, done: 3180 }, { d: "Tue", total: 3870, done: 3590 },
  { d: "Wed", total: 4120, done: 3840 }, { d: "Thu", total: 3760, done: 3520 },
  { d: "Fri", total: 4380, done: 4100 }, { d: "Sat", total: 2940, done: 2720 },
  { d: "Sun", total: 2210, done: 2050 },
];

export const revenueMonthly = [
  { m: "Jan", sub: 84200, sess: 38400, eap: 22100 }, { m: "Feb", sub: 88400, sess: 41200, eap: 24300 },
  { m: "Mar", sub: 91200, sess: 43800, eap: 26800 }, { m: "Apr", sub: 95600, sess: 46200, eap: 28400 },
  { m: "May", sub: 98900, sess: 49100, eap: 30200 }, { m: "Jun", sub: 103400, sess: 52300, eap: 32700 },
  { m: "Jul", sub: 108200, sess: 55800, eap: 35100 },
];

export const retentionData = [
  { m: "Jan", d7: 72, d30: 54, d90: 38 }, { m: "Feb", d7: 74, d30: 56, d90: 40 },
  { m: "Mar", d7: 76, d30: 58, d90: 42 }, { m: "Apr", d7: 75, d30: 57, d90: 41 },
  { m: "May", d7: 78, d30: 61, d90: 44 }, { m: "Jun", d7: 80, d30: 63, d90: 46 },
  { m: "Jul", d7: 82, d30: 65, d90: 48 },
];

export const expertCats = [
  { cat: "Astrology", experts: 312, sessions: 14200 }, { cat: "Therapy", experts: 248, sessions: 18900 },
  { cat: "Wellness", experts: 189, sessions: 11400 }, { cat: "Meditation", experts: 176, sessions: 9800 },
  { cat: "Nutrition", experts: 142, sessions: 7600 }, { cat: "Yoga", experts: 98, sessions: 6200 },
];

export const userDist = [
  { name: "Clients", value: 24891, tone: "teal" },
  { name: "Experts", value: 1247, tone: "emerald" },
  { name: "EAP", value: 4520, tone: "amber" },
];

export const clients = [
  { id: "USR-4821", name: "Priya Sharma", email: "priya.sharma@gmail.com", plan: "Premium", sessions: 24, joined: "Jul 14, 2026", status: "active", sign: "Scorpio" },
  { id: "USR-4820", name: "Arjun Mehta", email: "arjun.m@outlook.com", plan: "Basic", sessions: 8, joined: "Jul 14, 2026", status: "active", sign: "Taurus" },
  { id: "USR-4819", name: "Sofia Laurent", email: "sofia.l@email.com", plan: "Premium+", sessions: 47, joined: "Jul 13, 2026", status: "active", sign: "Libra" },
  { id: "USR-4818", name: "Rahul Gupta", email: "rahulg@company.com", plan: "EAP", sessions: 12, joined: "Jul 13, 2026", status: "pending", sign: "Gemini" },
  { id: "USR-4817", name: "Emma Wilson", email: "emma.w@proton.me", plan: "Basic", sessions: 3, joined: "Jul 12, 2026", status: "active", sign: "Aries" },
  { id: "USR-4816", name: "Kavya Nair", email: "kavya.n@mail.com", plan: "Premium", sessions: 31, joined: "Jul 12, 2026", status: "inactive", sign: "Cancer" },
];

export const experts = [
  { id: "EXP-0312", name: "Dr. Anika Rao", spec: "Vedic Astrology", rating: 4.9, sessions: 1284, earned: 38420, status: "verified" },
  { id: "EXP-0311", name: "James Hartwell", spec: "Jungian Therapy", rating: 4.8, sessions: 976, earned: 29380, status: "verified" },
  { id: "EXP-0310", name: "Preethi Venkat", spec: "Mindfulness Coach", rating: 4.7, sessions: 823, earned: 24690, status: "verified" },
  { id: "EXP-0309", name: "Mark Delacroix", spec: "Nutritionist", rating: 4.6, sessions: 641, earned: 19230, status: "pending" },
  { id: "EXP-0308", name: "Sunita Krishnan", spec: "Yoga Therapist", rating: 4.8, sessions: 512, earned: 15360, status: "verified" },
];

export const eapCompanies = [
  { company: "TechCorp India", employees: 2400, active: 1820, util: 76, plan: "Enterprise", rev: 48000, renew: "Dec 2026" },
  { company: "GlobalBank Ltd.", employees: 1800, active: 1240, util: 69, plan: "Professional", rev: 36000, renew: "Mar 2027" },
  { company: "HealthFirst Pvt.", employees: 950, active: 760, util: 80, plan: "Enterprise", rev: 19000, renew: "Jan 2027" },
  { company: "Zephyr Solutions", employees: 620, active: 410, util: 66, plan: "Professional", rev: 12400, renew: "Sep 2026" },
  { company: "Meridian Holdings", employees: 480, active: 312, util: 65, plan: "Starter", rev: 9600, renew: "Nov 2026" },
];

export const tickets = [
  { id: "TKT-8921", user: "Priya Sharma", type: "Billing", subject: "Subscription renewal failed", priority: "high", status: "open", date: "Jul 14", agent: "Ravi Kumar" },
  { id: "TKT-8920", user: "TechCorp India", type: "EAP", subject: "Employee onboarding issue", priority: "high", status: "in-progress", date: "Jul 14", agent: "Shweta " },
  { id: "TKT-8919", user: "Mark Delacroix", type: "Expert", subject: "Profile verification pending", priority: "medium", status: "in-progress", date: "Jul 13", agent: "Ankit Singh" },
  { id: "TKT-8918", user: "Emma Wilson", type: "App", subject: "Session recording not saving", priority: "medium", status: "open", date: "Jul 13", agent: null },
  { id: "TKT-8917", user: "Arjun Mehta", type: "Billing", subject: "Refund for cancelled session", priority: "low", status: "resolved", date: "Jul 12", agent: "Ravi Kumar" },
  { id: "TKT-8916", user: "GlobalBank Ltd.", type: "EAP", subject: "Analytics report access", priority: "low", status: "resolved", date: "Jul 11", agent: "Shweta " },
];

export const transactions = [
  { id: "TXN-20192", user: "Priya Sharma", type: "Subscription", amount: 2999, status: "success", date: "Jul 14", method: "Card" },
  { id: "TXN-20191", user: "TechCorp India", type: "EAP Invoice", amount: 48000, status: "success", date: "Jul 14", method: "Bank Transfer" },
  { id: "TXN-20190", user: "Sofia Laurent", type: "Session", amount: 1499, status: "success", date: "Jul 13", method: "UPI" },
  { id: "TXN-20189", user: "Rahul Gupta", type: "Subscription", amount: 999, status: "pending", date: "Jul 13", method: "Card" },
  { id: "TXN-20188", user: "Emma Wilson", type: "Refund", amount: -1499, status: "processing", date: "Jul 12", method: "Card" },
  { id: "TXN-20186", user: "Dr. Anika Rao", type: "Expert Payout", amount: -12800, status: "success", date: "Jul 12", method: "Bank Transfer" },
];

export const adminTeam = [
  { id: "ADM-001", name: "Rashmi", role: "Super Admin", email: "rashmi.guia@zodiacpluss.com", dept: "Executive", status: "active", lastLogin: "2 min ago", perms: ["all"] },
  { id: "ADM-002", name: "Shubham Maloo", role: "Finance Admin", email: "vikram.a@zodiacpluss.com", dept: "Finance", status: "active", lastLogin: "1 hour ago", perms: ["finance", "reports"] },
  { id: "ADM-003", name: "Shweta ", role: "Support Lead", email: "sneha.p@zodiacpluss.com", dept: "Support", status: "active", lastLogin: "15 min ago", perms: ["support", "users"] },
  { id: "ADM-004", name: "Ankit Singh", role: "Content Admin", email: "ankit.s@zodiacpluss.com", dept: "Product", status: "active", lastLogin: "3 hours ago", perms: ["content", "experts"] },
  { id: "ADM-005", name: "Ravi Kumar", role: "Support Agent", email: "ravi.k@zodiacpluss.com", dept: "Support", status: "active", lastLogin: "5 min ago", perms: ["support"] },
  { id: "ADM-006", name: "Meera Joshi", role: "Marketing Admin", email: "meera.j@zodiacpluss.com", dept: "Marketing", status: "inactive", lastLogin: "2 days ago", perms: ["analytics", "content"] },
];

export const appReleases = [
  { app: "Client App (iOS)", version: "4.2.1", status: "live", users: "18.4K", rating: 4.8, date: "Jul 10, 2026" },
  { app: "Client App (Android)", version: "4.2.0", status: "live", users: "6.5K", rating: 4.6, date: "Jul 8, 2026" },
  { app: "Expert App (iOS)", version: "3.8.2", status: "live", users: "720", rating: 4.7, date: "Jul 9, 2026" },
  { app: "Expert App (Android)", version: "3.8.1", status: "review", users: "527", rating: 4.5, date: "Jul 12, 2026" },
  { app: "Admin Web Panel", version: "2.1.0", status: "live", users: "6", rating: null, date: "Jul 1, 2026" },
];

export const featureFlags = [
  { name: "Astrology Chat v2", desc: "New real-time chat interface for astrology sessions", env: "Production", status: true, rollout: 100 },
  { name: "Group Sessions Beta", desc: "Allow experts to host sessions for up to 10 users", env: "Production", status: true, rollout: 25 },
  { name: "AI Match Engine", desc: "ML-based expert-user compatibility matching", env: "Staging", status: false, rollout: 0 },
  { name: "Voice Sessions", desc: "Audio-only session option for privacy-conscious users", env: "Production", status: true, rollout: 60 },
  { name: "EAP Dashboard v2", desc: "New corporate admin dashboard with drill-down analytics", env: "Dev", status: false, rollout: 0 },
  { name: "Smart Reminders", desc: "AI-generated session reminders based on user behaviour", env: "Production", status: true, rollout: 80 },
];

export const contentItems = [
  { title: "Mercury Retrograde Guide 2026", type: "Article", category: "Astrology", status: "published", views: 48200, date: "Jul 10" },
  { title: "10-Minute Workplace Mindfulness", type: "Video", category: "Wellness", status: "published", views: 32100, date: "Jul 8" },
  { title: "Understanding Your Birth Chart", type: "Course", category: "Astrology", status: "draft", views: 0, date: "Jul 14" },
  { title: "Emotional Regulation Workbook", type: "PDF", category: "Therapy", status: "published", views: 19800, date: "Jun 28" },
  { title: "Full Moon Meditation Series", type: "Audio", category: "Meditation", status: "scheduled", views: 0, date: "Jul 20" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "alert", icon: AlertTriangle, tone: "rose", title: "High priority ticket opened", body: "TKT-8921 — Priya Sharma billing issue needs immediate attention", time: "2 min ago", read: false },
  { id: 2, type: "user", icon: UserPlus, tone: "teal", title: "New expert application", body: "Dr. Rahul Verma applied as a Vedic Astrology expert — review pending", time: "18 min ago", read: false },
  { id: 3, type: "payment", icon: DollarSign, tone: "emerald", title: "EAP invoice received", body: "TechCorp India paid ₹48,000 for July EAP subscription", time: "1h ago", read: false },
  { id: 4, type: "system", icon: Rocket, tone: "violet", title: "Expert App v3.8.2 in review", body: "Android app submitted to Play Store — review typically 24–48h", time: "3h ago", read: true },
  { id: 5, type: "alert", icon: Activity, tone: "amber", title: "Session volume spike", body: "Friday sessions are 24% above the weekly average — servers scaled", time: "5h ago", read: true },
  { id: 6, type: "user", icon: CheckCircle, tone: "emerald", title: "Expert verified", body: "James Hartwell's credentials were verified by the review team", time: "Yesterday", read: true },
];

export const CALENDAR_EVENTS = [
  {
    id: 1, title: "Design Conference", org: "Zillul Design Agency",
    date: "Today 07:19 AM", address: "56 Davion Mission Suite 157", location: "Meaghanberg",
    tone: "violet",
    attendees: 18, gridCol: 3, gridRow: 2, span: 1,
    month: 10, day: 3,
  },
  {
    id: 2, title: "Weekend Festival", org: "",
    date: "16 October 2026 at 5:00 PM", address: "853 Moore Flats Suite 158", location: "Sweden",
    tone: "rose",
    attendees: 23, gridCol: 1, gridRow: 4, span: 1,
    month: 10, day: 18,
  },
  {
    id: 3, title: "Glastonbury Festival", org: "",
    date: "20–22 October 2026 at 8:00 PM", address: "646 Walter Road Apt. 571", location: "Turks and Caicos Islands",
    tone: "amber",
    attendees: 17, gridCol: 5, gridRow: 4, span: 3,
    month: 10, day: 20,
  },
  {
    id: 4, title: "Ultra Europe 2026", org: "",
    date: "25 October 2026 at 10:00 PM", address: "506 Satterfield Tunnel Apt. 963", location: "San Marino",
    tone: "teal",
    attendees: 45, gridCol: 4, gridRow: 5, span: 1,
    month: 10, day: 25,
  },
];

export const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard" },
  { id: "clients", label: "Client Users" },
  { id: "experts", label: "Expert Users" },
  { id: "support", label: "Inbox", badge: 23 },
  { id: "finance", label: "Transactions" },
];

export const NAV_PAGES = [
  { id: "pricing", label: "Pricing" },
  { id: "eap", label: "EAP / Calendar" },
  { id: "analytics", label: "Analytics" },
  { id: "operations", label: "Operations" },
  { id: "adminteam", label: "Admin Team" },
  { id: "reports", label: "Reports" },
  { id: "ui", label: "UI Elements" },
  { id: "table", label: "Data Table" },
];

export const PAGE_CRUMBS = {
  dashboard: ["Dashboard"],
  clients: ["Client Users"],
  experts: ["Expert Users"],
  support: ["Inbox / Support"],
  finance: ["Finance", "Transactions"],
  pricing: ["Pages", "Pricing"],
  eap: ["Pages", "EAP / Calendar"],
  analytics: ["Pages", "Analytics"],
  operations: ["Pages", "Operations"],
  adminteam: ["Pages", "Admin Team"],
  reports: ["Pages", "Reports"],
  ui: ["Pages", "UI Elements"],
  table: ["Pages", "Data Table"],
  settings: ["Settings"],
  profile: ["My Profile"],
};
