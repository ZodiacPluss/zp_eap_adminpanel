import React from "react";
import zodiacLogo from "@/imports/Zodiac_Colored_Logo_croped-removebg-preview.png";
import { Sun, UserRound } from "lucide-react";
import { SIDEBAR_W } from "@/app/data/designTokens";
import { usePalette, useAccents } from "@/app/theme/ThemeProvider";
import { NAV_MAIN, NAV_PAGES } from "@/app/data/mockData";
import { useIsMobile } from "@/app/hooks/useResponsive";

function NavItem({ label, isActive, badge, onClick }) {
  const P = usePalette();
  const A = useAccents();
  return (
    <div className="group relative px-2">
      {isActive && (
        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full"
          style={{ background: P.brand }} />
      )}
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-lg px-4 py-[9px] text-[14px] transition-colors duration-150 hover:bg-[var(--zp-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/25"
        style={{
          background: isActive ? `${A.brand}1a` : "transparent",
          color: isActive ? P.brandDeep : P.navy,
          fontWeight: isActive ? 600 : 450,
        }}>
        <span className="truncate">{label}</span>
        {badge ? (
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none"
            style={{ background: isActive ? P.brand : `${A.rose}26`, color: isActive ? P.onAccent : P.rose }}>{badge}</span>
        ) : null}
      </button>
    </div>
  );
}

function SidebarContent({ active, handleNavClick, onLogout, user }) {
  const P = usePalette();
  const A = useAccents();
  const userName = user?.name || user?.fullName || user?.displayName || "Rashmi";
  const avatarUrl = user?.avatarUrl || user?.profileImage || user?.imageUrl || user?.image;

  return (
    <>
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--zp-border)] px-5 pb-5 pt-6">
        <img src={zodiacLogo} alt="ZodiacPluss Logo" className="h-[62px] w-[62px] flex-shrink-0 object-contain" draggable={false} />
        <div className="min-w-0">
          <div className="mb-1 flex items-center leading-none">
            <span style={{ color: P.navy, fontSize: "22px", fontWeight: 600, letterSpacing: "-0.3px", fontFamily: "'Inter', sans-serif" }}>ZodiacPluss</span>
          </div>
          <p className="whitespace-nowrap text-[9px] leading-tight tracking-wide" style={{ color: P.slateLight }}>Your Personal Wellness Companion</p>
        </div>
      </div>

      {/* Greeting card */}
      <div className="mx-4 mb-4 mt-4 flex-shrink-0">
        <div className="flex min-h-[78px] items-center gap-2.5 rounded-2xl border px-3 py-2.5"
          style={{
            borderColor: `${A.brand}29`,
            background: `linear-gradient(135deg,${A.brand}14 0%,${A.brand}24 100%)`,
            boxShadow: `0 4px 12px ${P.shadow}`,
          }}>
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: `${A.brand}29`, color: P.brandDeep }}>
            <UserRound size={21} strokeWidth={1.8} aria-hidden="true" />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${userName} profile`}
                className="absolute h-10 w-10 rounded-full object-cover"
                onError={(event) => event.currentTarget.classList.add("hidden")}
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-bold leading-tight" style={{ color: P.navy }}>Hello {userName}!</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="text-[11px] font-medium leading-none text-[var(--zp-slate)]">Good morning</span>
              <Sun size={15} strokeWidth={2} style={{ color: P.brand }} aria-hidden="true" />
            </div>
          </div>
          <div className="hidden w-[42px] flex-shrink-0 border-l pl-2 text-[9px] font-medium italic leading-[1.35] min-[250px]:block"
            style={{ borderColor: `${A.brand}33`, color: P.slate }}>
            Small steps,<br />brighter days.
          </div>
        </div>
      </div>
      <div className="mx-4 mb-2 h-px flex-shrink-0 bg-[var(--zp-border)]" />

      <div className="flex-1 overflow-y-auto">
        <div className="px-0 pb-1 pt-1">
          {NAV_MAIN.map(item => (
            <NavItem key={item.id} label={item.label} isActive={active === item.id}
              badge={"badge" in item ? item.badge : undefined} onClick={() => handleNavClick(item.id)} />
          ))}
        </div>
        <div className="mx-4 my-3 h-px bg-[var(--zp-border)]" />
        <div className="px-6 pb-1 pt-1">
          <p className="mb-2 text-[10px] font-semibold tracking-[0.14em]" style={{ color: P.slateLight }}>PAGES</p>
        </div>
        <div className="px-0 pb-2">
          {NAV_PAGES.map(item => (
            <NavItem key={item.id} label={item.label} isActive={active === item.id} onClick={() => handleNavClick(item.id)} />
          ))}
        </div>
        <div className="mx-4 my-3 h-px bg-[var(--zp-border)]" />
        <div className="px-0 pb-6">
          <NavItem label="Settings" isActive={active === "settings"} onClick={() => handleNavClick("settings")} />
          <button type="button" onClick={onLogout} className="mx-2 flex w-[calc(100%-1rem)] items-center rounded-lg px-4 py-[9px] text-left text-[14px] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-rose)]/12 hover:text-[var(--zp-rose)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-rose)]/30">Logout</button>
        </div>
      </div>
    </>
  );
}

export default function SidebarNav({ active, setActive, collapsed, setCollapsed, onLogout, user }) {
  const P = usePalette();
  const A = useAccents();
  const isMobile = useIsMobile();
  const sidebarOpen = !collapsed;

  const handleNavClick = (id) => {
    setActive(id);
    if (isMobile) setCollapsed(true);
  };

  const content = (
    <SidebarContent active={active} handleNavClick={handleNavClick} onLogout={onLogout} user={user} />
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ background: P.overlay, backdropFilter: "blur(2px)" }}
            onClick={() => setCollapsed(true)}
          />
        )}
        <aside
          className="fixed left-0 top-0 h-screen z-50 flex flex-col select-none overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: 280,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            background: P.sidebar,
            borderRight: `1px solid ${P.border}`,
            boxShadow: sidebarOpen ? `8px 0 32px ${P.shadow}` : "none",
          }}>
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-40 flex flex-col select-none overflow-hidden transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 0 : SIDEBAR_W,
        background: P.sidebar,
        boxShadow: `4px 0 24px ${P.shadow}`,
        borderRight: `1px solid ${P.border}`,
      }}>
      {content}
    </aside>
  );
}
