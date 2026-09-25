import React from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./sheet";
import { cn } from "./utils";

/** Right-hand drawer used by the redesigned pages: dimmed page, titled header, scrolling body. */
export function SideDrawer({ open, onOpenChange, title, description, className, children }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgb(71_85_105/0.35)] dark:bg-black/60"
        closeClassName="right-[30px] top-[30px] rounded-md p-1 text-[var(--zp-slate)] opacity-100 hover:bg-[var(--zp-hover)] [&_svg]:size-5"
        className={cn("zp-font w-full gap-0 overflow-y-auto border-[var(--zp-border)] bg-[var(--zp-card)] p-0 sm:max-w-[480px]", className)}
      >
        <header className="border-b border-[var(--zp-border)] px-[35px] pb-5 pt-[26px]">
          <SheetTitle className="pr-10 text-[24px] font-semibold tracking-[-0.01em] text-[var(--zp-navy)]">{title}</SheetTitle>
          <SheetDescription className="mt-1 text-[14px] text-[var(--zp-slate)]">{description}</SheetDescription>
        </header>
        {children}
      </SheetContent>
    </Sheet>
  );
}

export default SideDrawer;
