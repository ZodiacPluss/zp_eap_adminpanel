import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import { Sparkles } from "lucide-react";
import { SIDEBAR_W } from "@/app/data/designTokens";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { useIsMobile } from "@/app/hooks/useResponsive";
import { Card } from "@/app/components/ui/Card";
import { PageShell } from "@/app/components/ui/PageShell";

// ─── Layout Components ────────────────────────────────────────────────────────
import SidebarNav from "@/app/components/layout/SidebarNav";
import TopNavHeader from "@/app/components/layout/TopNavHeader";
import QuickActionButton from "@/app/components/layout/QuickActionButton";

// ─── Authentication pages ─────────────────────────────────────────────────────
import LoginPage from "@/app/pages/auth/LoginPage";

// ─── Main private pages ───────────────────────────────────────────────────────
import DashboardOverviewPage from "@/app/pages/dashboard/DashboardOverviewPage";
import ClientsManagementPage from "@/app/pages/dashboard/ClientsManagementPage";
import EmployeesManagementPage from "@/app/pages/dashboard/EmployeesManagementPage";
import ProgramsPage from "@/app/pages/dashboard/ProgramsPage";
import ContactSupportDialog from "@/app/components/support/ContactSupportDialog";
import ExpertsManagementPage from "@/app/pages/dashboard/ExpertsManagementPage";
import EAPCalendarPage from "@/app/pages/dashboard/EAPCalendarPage";
import TransactionsFinancePage from "@/app/pages/dashboard/TransactionsFinancePage";
import AnalyticsInsightsPage from "@/app/pages/dashboard/AnalyticsInsightsPage";
import OperationsReleasePage from "@/app/pages/dashboard/OperationsReleasePage";
import AdminTeamManagementPage from "@/app/pages/dashboard/AdminTeamManagementPage";
import SupportInboxPage from "@/app/pages/dashboard/SupportInboxPage";
import SettingsConfigPage from "@/app/pages/dashboard/SettingsConfigPage";
import AdminProfilePage from "@/app/pages/dashboard/AdminProfilePage";

const DEFAULT_PROFILE = {
  name: "Amit Sharma",
  email: "amit.sharma@abctechnologies.com",
  phone: "+91 98765 43210",
  role: "HR Administrator",
  timezone: "Asia/Kolkata (IST)",
  language: "English (India)",
  about: "Guiding people towards a more mindful and balanced tomorrow.",
};

// Placeholder for pages not yet fully built
const ComingSoon = ({ title }) => {
  const P = usePalette();
  const A = useAccents();
  return (
  <PageShell title={title}>
    <Card className="p-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${A.brand}2e` }}>
        <Sparkles size={28} style={{ color: P.brand }} />
      </div>
      <h2 className="text-lg font-bold text-[var(--zp-navy)] mb-1">{title}</h2>
      <p className="text-sm text-[var(--zp-slate-light)]">This section is being built. Check back soon.</p>
    </Card>
  </PageShell>
  );
};

// Pages that are not in the sidebar yet (clients … table) stay wired here so
// they can be linked again as their redesigns land.
// Header search hint per page, where the design names one.
const SEARCH_PLACEHOLDERS = {
  employees: "Search by name, email or employee ID...",
  programs: "Search by name, email or employee ID...",
};

// Pages rebuilt from the new designs; the legacy floating quick-action button is not part of them.
const REDESIGNED_PAGES = new Set(["dashboard", "employees", "programs"]);

const PAGES = {
  assessments: <ComingSoon title="Assessments" />,
  departments: <ComingSoon title="Departments" />,
  organization: <ComingSoon title="Organization" />,
  resources: <ComingSoon title="Resources" />,
  clients: <ClientsManagementPage />,
  experts: <ExpertsManagementPage />,
  eap: <EAPCalendarPage />,
  finance: <TransactionsFinancePage />,
  analytics: <AnalyticsInsightsPage />,
  operations: <OperationsReleasePage />,
  adminteam: <AdminTeamManagementPage />,
  support: <SupportInboxPage />,
  pricing: <ComingSoon title="Pricing" />,
  reports: <ComingSoon title="Reports" />,
  ui: <ComingSoon title="UI Elements" />,
  table: <ComingSoon title="Data Table" />,
};

export default function App() {
  const P = usePalette();
  const A = useAccents();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [supportOpen, setSupportOpen] = useState(false);
  // Header search runs against the employee directory; `id` lets the same query be sent twice.
  const [employeeSearch, setEmployeeSearch] = useState(null);

  // Authentication State
  const [user, setUser] = useState(null);

  const isMobile = useIsMobile();

  // Load session from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("zp_admin_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("zp_admin_session");
      }
    }
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem("zp_admin_profile");
    if (savedProfile) {
      try {
        setProfile(current => ({ ...current, ...JSON.parse(savedProfile) }));
      } catch {
        localStorage.removeItem("zp_admin_profile");
      }
    }
  }, []);

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem("zp_admin_session", JSON.stringify(authenticatedUser));
    setActive("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("zp_admin_session");
  };

  const handleProfileSave = (nextProfile) => {
    setProfile(nextProfile);
    localStorage.setItem("zp_admin_profile", JSON.stringify(nextProfile));
  };

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const ml = isMobile ? 0 : (collapsed ? 0 : SIDEBAR_W);

  const handleGlobalSearch = (query) => {
    setEmployeeSearch({ query, id: Date.now() });
    setActive("employees");
  };

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <DashboardOverviewPage profile={profile} onNavigate={setActive} />;
      case "employees": return <EmployeesManagementPage onNavigate={setActive} searchRequest={employeeSearch} />;
      case "programs": return <ProgramsPage onNavigate={setActive} onContactSupport={() => setSupportOpen(true)} />;
      case "profile": return <AdminProfilePage profile={profile} onEdit={() => setActive("settings")} />;
      case "settings": return <SettingsConfigPage profile={profile} onSave={handleProfileSave} />;
      default: return PAGES[active] ?? <DashboardOverviewPage profile={profile} onNavigate={setActive} />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} minDuration={3500} />;
  }

  // Admin access is intentionally limited to the sign-in entry point.
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-pageEnter {
          animation: fadeSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
      <div className="min-h-screen" style={{ background: P.bg, fontFamily: "'Inter',system-ui,sans-serif" }}>
        <SidebarNav active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} profile={profile} onContactSupport={() => setSupportOpen(true)} />
        <TopNavHeader ml={ml} searchPlaceholder={SEARCH_PLACEHOLDERS[active]} onSearch={handleGlobalSearch} onToggleSidebar={() => setCollapsed(v => !v)} onNavigate={setActive} onLogout={handleLogout} profile={profile} />
        <main className="pt-16 transition-all duration-300 ease-in-out" style={{ marginLeft: ml }}>
          {/* Home sits flush under the header, as in its design. */}
          <div className={`${isMobile ? "p-4" : "p-7"} ${active === "dashboard" && !isMobile ? "pt-1 pb-4" : ""} max-w-[1600px] mx-auto`}>
            <div key={active} className="animate-pageEnter">
              {renderPage()}
            </div>
          </div>
        </main>
        {!REDESIGNED_PAGES.has(active) && <QuickActionButton />}
        <ContactSupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
      </div>
    </>
  );
}
