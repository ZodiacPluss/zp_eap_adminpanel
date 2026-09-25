import React from "react";
import { ArrowRight, ChevronRight, Headset } from "lucide-react";
import { SIDEBAR_W, initials } from "@/app/data/designTokens";
import { usePalette } from "@/app/theme/ThemeProvider";
import { NAV_ITEMS } from "@/app/data/mockData";
import { useIsMobile } from "@/app/hooks/useResponsive";

/** ZodiacPluss logo from Cloudinary. */
function BrandMark() {
  return (
    <img
      src="https://res.cloudinary.com/pp0lpskp/image/upload/v1786032742/Zodiac_Colored_Logo_croped-removebg-preview_appzet.png"
      alt="ZodiacPluss logo"
      className="h-11 w-11 shrink-0 object-contain"
      draggable={false}
    />
  );
}

function NavItem({ label, icon: Icon, isActive, onClick }) {
  return (
    <li className="relative">
      {isActive && (
        <span aria-hidden="true" className="absolute -left-[22px] top-0 h-full w-[5px] rounded-r-full bg-[var(--zp-brand)]" />
      )}
      <button
        type="button"
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={`flex h-[42px] w-full items-center gap-6 rounded-lg pl-[13px] pr-3 text-left text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--zp-brand)]/30 ${
          isActive
            ? "bg-[var(--zp-brand)]/10 font-semibold text-[var(--zp-brand-deep)]"
            : "text-[var(--zp-navy)] hover:bg-[var(--zp-hover)]"
        }`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 ${isActive ? "text-[var(--zp-brand)]" : "text-[var(--zp-slate)]"}`}
          strokeWidth={1.7}
          aria-hidden="true"
        />
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

function SidebarContent({ active, onNavigate, profile, onContactSupport }) {
  const name = profile?.name || "Admin";

  return (
    <div className="zp-font flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 pl-6 pr-4 pt-[22px] pb-1">
        <BrandMark />
        <div className="min-w-0">
          <p className="text-[21px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--zp-navy)]">ZodiacPluss</p>
          <p className="whitespace-nowrap text-[11px] text-[var(--zp-slate)]">EAP for a better tomorrow</p>
        </div>
      </div>

      <nav aria-label="Main" className="mt-[31px] min-h-0 flex-1 overflow-y-auto pl-[22px] pr-[9px]">
        <ul className="flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              isActive={active === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </ul>
      </nav>

      <div className="ml-[22px] mr-[6px] mt-4 shrink-0 rounded-xl bg-[var(--zp-brand)]/[0.07] px-[15px] pb-3 pt-4">
        <div className="flex items-start gap-3">
          <Headset className="mt-0.5 h-6 w-6 shrink-0 text-[var(--zp-brand)]" strokeWidth={1.6} aria-hidden="true" />
          <div>
            <p className="text-[14px] font-semibold leading-5 text-[var(--zp-navy)]">Need support?</p>
            <p className="mt-0.5 text-[12px] text-[var(--zp-slate)]">Our team is here for you.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onContactSupport}
          className="mt-3 flex h-[35px] w-full items-center justify-center gap-2 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] text-[14px] font-medium text-[var(--zp-brand-deep)] shadow-[0_1px_2px_var(--zp-shadow)] transition-colors hover:bg-[var(--zp-hover)]"
        >
          Contact Support
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onNavigate("profile")}
        className="mx-[14px] mb-[26px] mt-[14px] flex shrink-0 items-center gap-3 rounded-xl px-[14px] py-1.5 text-left transition-colors hover:bg-[var(--zp-hover)]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--zp-navy)] text-[14px] font-medium text-[var(--zp-card)]">
          {initials(name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-[var(--zp-navy)]">{name}</span>
          <span className="block truncate text-[12.5px] text-[var(--zp-slate)]">{profile?.role}</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function SidebarNav({ active, setActive, collapsed, setCollapsed, profile, onContactSupport }) {
  const P = usePalette();
  const isMobile = useIsMobile();
  const sidebarOpen = !collapsed;

  const handleNavigate = (id) => {
    setActive(id);
    if (isMobile) setCollapsed(true);
  };

  const content = <SidebarContent active={active} onNavigate={handleNavigate} profile={profile} onContactSupport={onContactSupport} />;

  if (isMobile) {
    return (
      <>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 transition-opacity duration-300"
            style={{ background: P.overlay, backdropFilter: "blur(2px)" }}
            onClick={() => setCollapsed(true)}
          />
        )}
        <aside
          className="fixed left-0 top-0 z-50 h-screen select-none overflow-hidden border-r border-[var(--zp-border)] bg-[var(--zp-sidebar)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            width: SIDEBAR_W,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            boxShadow: sidebarOpen ? `8px 0 32px ${P.shadow}` : "none",
          }}>
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen select-none overflow-hidden border-r border-[var(--zp-border)] bg-[var(--zp-sidebar)] transition-all duration-300 ease-in-out"
      style={{ width: collapsed ? 0 : SIDEBAR_W }}>
      {content}
    </aside>
  );
}
