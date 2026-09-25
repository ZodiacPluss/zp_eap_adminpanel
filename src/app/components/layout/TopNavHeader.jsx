import React, { useEffect, useState, useRef } from "react";
import { Menu, Search, Sun, Moon, Bell, ChevronDown, Check, UserCog, Settings, FileText, LogOut } from "lucide-react";
import { usePalette, useTheme } from "@/app/theme/ThemeProvider";
import { initials } from "@/app/data/designTokens";
import { ORGANIZATIONS } from "@/app/data/mockData";
import { useIsMobile } from "@/app/hooks/useResponsive";
import { cn } from "@/app/components/ui/utils";
import { useDismiss } from "@/app/hooks/useDismiss";
import NotificationPanel from "./NotificationPanel";

const menuPanel = "absolute z-50 overflow-hidden rounded-xl border border-[var(--zp-border)] bg-[var(--zp-card)] shadow-[0_20px_40px_var(--zp-shadow)]";
const menuItem = "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] text-[var(--zp-slate)] transition-colors hover:bg-[var(--zp-hover)]";

export default function TopNavHeader({ ml, onToggleSidebar, onNavigate, onLogout, profile, onSearch, searchPlaceholder = "Search employees, programs..." }) {
  const P = usePalette();
  const { dark, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [openMenu, setOpenMenu] = useState(null); // "org" | "notifications" | "profile" | null
  const [organizationId, setOrganizationId] = useState(ORGANIZATIONS[0].id);
  const orgRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");

  // ⌘K / Ctrl+K jumps to the search box.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    onSearch?.(query);
    setSearch("");
    searchRef.current?.blur();
  };

  const close = React.useCallback(() => setOpenMenu(null), []);
  useDismiss(orgRef, openMenu === "org", close);
  useDismiss(notifRef, openMenu === "notifications", close);
  useDismiss(profileRef, openMenu === "profile", close);

  const toggle = (menu) => setOpenMenu((current) => (current === menu ? null : menu));
  const name = profile?.name || "Admin";
  const organization = ORGANIZATIONS.find((org) => org.id === organizationId) ?? ORGANIZATIONS[0];

  return (
    <header className="zp-font fixed right-0 top-0 z-30 flex h-16 items-center gap-3 px-4 transition-all duration-300 sm:px-6 lg:pl-[30px] lg:pr-8"
      style={{ left: isMobile ? 0 : ml, background: P.header, backdropFilter: "blur(20px)" }}>

      {isMobile && (
        <button type="button" onClick={onToggleSidebar} aria-label="Open navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--zp-slate)] transition-colors hover:bg-[var(--zp-hover)]">
          <Menu size={18} />
        </button>
      )}

      {/* Organization selector */}
      <div ref={orgRef} className="relative min-w-0">
        <button type="button" onClick={() => toggle("org")} aria-haspopup="listbox" aria-expanded={openMenu === "org"}
          className="flex min-w-0 items-center gap-2 rounded-lg py-1.5 pr-2 text-[14px] font-semibold text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)]">
          <span aria-hidden="true" className="h-4 w-[2px] shrink-0 rounded-full bg-[var(--zp-brand)]/40" />
          <span className="ml-2.5 truncate">{organization.name}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />
        </button>
        {openMenu === "org" && (
          <ul role="listbox" aria-label="Organization" className={`${menuPanel} left-0 top-11 w-56 py-1`}>
            {ORGANIZATIONS.map((org) => (
              <li key={org.id} role="option" aria-selected={org.id === organizationId}>
                <button type="button" className={menuItem} onClick={() => { setOrganizationId(org.id); close(); }}>
                  <span className="flex-1 text-[var(--zp-navy)]">{org.name}</span>
                  {org.id === organizationId && <Check className="h-4 w-4 text-[var(--zp-brand)]" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4 lg:gap-[22px]">
        <form role="search" onSubmit={submitSearch} className="relative hidden w-[312px] md:block">
          <label htmlFor="global-search" className="sr-only">Search employees</label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--zp-slate-light)]" aria-hidden="true" />
          <input ref={searchRef} id="global-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={searchPlaceholder}
            className="h-9 w-full rounded-[10px] border border-[var(--zp-border)] bg-[var(--zp-card)] pl-10 pr-12 text-[13px] text-[var(--zp-navy)] outline-none transition-shadow placeholder:text-[var(--zp-slate-light)] focus:ring-[3px] focus:ring-[var(--zp-brand)]/20" />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-[var(--zp-surface)] px-1.5 py-0.5 font-sans text-[10.5px] text-[var(--zp-slate-light)]">⌘K</kbd>
        </form>

        <div ref={notifRef} className="relative">
          <button type="button" onClick={() => toggle("notifications")} aria-label="Notifications" aria-expanded={openMenu === "notifications"}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--zp-slate)] transition-colors hover:bg-[var(--zp-hover)]">
            <Bell className="h-5 w-5" strokeWidth={1.7} />
            <span aria-hidden="true" className="absolute right-[7px] top-[6px] h-2 w-2 rounded-full bg-[var(--zp-rose)] ring-2 ring-[var(--zp-bg)]" />
          </button>
          {openMenu === "notifications" && <NotificationPanel onClose={close} />}
        </div>

        <div ref={profileRef} className="relative">
          <button type="button" onClick={() => toggle("profile")} aria-label="Account menu" aria-expanded={openMenu === "profile"}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--zp-navy)] text-[13px] font-medium text-[var(--zp-card)] transition-shadow hover:ring-4 hover:ring-[var(--zp-brand)]/15">
            {initials(name)}
          </button>
          {openMenu === "profile" && (
            <div className={`${menuPanel} right-0 top-12 w-56`}>
              <div className="border-b border-[var(--zp-border)] p-4">
                <div className="text-[13px] font-semibold text-[var(--zp-navy)]">{name}</div>
                <div className="mt-0.5 truncate text-[11.5px] text-[var(--zp-slate-light)]">{profile?.email}</div>
              </div>
              {[["My Profile", UserCog, "profile"], ["Settings", Settings, "settings"], ["Audit Log", FileText, null]].map(([label, Icon, destination]) => (
                <button key={label} type="button" className={menuItem}
                  onClick={() => { close(); if (destination) onNavigate(destination); }}>
                  <Icon size={14} className="text-[var(--zp-brand)]" />{label}
                </button>
              ))}
              <button type="button" className={menuItem} onClick={toggleTheme} aria-pressed={dark}>
                {dark ? <Sun size={14} className="text-[var(--zp-brand)]" /> : <Moon size={14} className="text-[var(--zp-brand)]" />}
                {dark ? "Light mode" : "Dark mode"}
              </button>
              <div className="border-t border-[var(--zp-border)]">
                <button type="button" onClick={onLogout} className={cn(menuItem, "text-[var(--zp-rose)] hover:bg-[var(--zp-rose)]/10")}>
                  <LogOut size={14} />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
