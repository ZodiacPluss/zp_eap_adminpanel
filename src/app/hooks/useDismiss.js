import { useEffect } from "react";

/**
 * Close a popover when the pointer goes down outside of `ref`, or on Escape.
 * `ref` may also be an array of refs that all count as "inside".
 */
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const refs = Array.isArray(ref) ? ref : [ref];
    const onPointer = (e) => {
      if (refs.every((r) => !r.current || !r.current.contains(e.target))) onClose();
    };
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

export default useDismiss;
