import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Eye, SquarePen, Users, ChartColumn, CircleSlash, CircleCheck } from "lucide-react";
import { useDismiss } from "@/app/hooks/useDismiss";

const itemClass =
  "flex w-full items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-left text-[14px] font-medium text-[var(--zp-navy)] transition-colors hover:bg-[var(--zp-hover)] focus-visible:bg-[var(--zp-hover)] focus-visible:outline-none";

export const MENU_WIDTH = 210;

/**
 * Row actions for one department. Portalled and fixed to the viewport, the same
 * way the employee directory's row menu is, so the page's enter animation does
 * not become its containing block.
 */
export function DepartmentActionMenu({ menu, onAction, onClose }) {
  const ref = useRef(null);
  useDismiss([ref, menu.anchorRef], true, onClose);

  useEffect(() => {
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  const { department } = menu;
  const active = department.status === "Active";

  return createPortal(
    <div ref={ref} role="menu" aria-label={`Actions for ${department.name}`}
      className="zp-font fixed z-40 rounded-lg border border-[var(--zp-border)] bg-[var(--zp-card)] p-1 shadow-[0_12px_32px_var(--zp-shadow)]"
      style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}>
      <button type="button" role="menuitem" autoFocus className={itemClass} onClick={() => onAction("view", department)}>
        <Eye className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />View Department
      </button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => onAction("edit", department)}>
        <SquarePen className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />Edit Department
      </button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => onAction("employees", department)}>
        <Users className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />Manage Employees
      </button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => onAction("reports", department)}>
        <ChartColumn className="h-4 w-4 shrink-0 text-[var(--zp-slate)]" aria-hidden="true" />View Reports
      </button>

      <div className="my-1 border-t border-[var(--zp-border)]" />

      {active ? (
        <button type="button" role="menuitem" onClick={() => onAction("deactivate", department)}
          className={`${itemClass} text-[var(--zp-rose)] hover:bg-[var(--zp-rose)]/10 focus-visible:bg-[var(--zp-rose)]/10`}>
          <CircleSlash className="h-4 w-4 shrink-0" aria-hidden="true" />Deactivate Department
        </button>
      ) : (
        <button type="button" role="menuitem" onClick={() => onAction("activate", department)}
          className={`${itemClass} text-[var(--zp-emerald)] hover:bg-[var(--zp-emerald)]/10 focus-visible:bg-[var(--zp-emerald)]/10`}>
          <CircleCheck className="h-4 w-4 shrink-0" aria-hidden="true" />Activate Department
        </button>
      )}
    </div>,
    document.body,
  );
}

export default DepartmentActionMenu;
