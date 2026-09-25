import React from "react";

/** On/off switch. Wrap it in a <label> with its text so the whole row toggles it. */
export function Switch({ checked, onCheckedChange, disabled, id, ...rest }) {
  return (
    <span className="relative inline-flex shrink-0">
      <input id={id} type="checkbox" role="switch" checked={checked} disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)} className="peer sr-only" {...rest} />
      <span aria-hidden="true"
        className="relative h-[27px] w-[49px] rounded-full bg-[var(--zp-border-strong)] transition-colors peer-checked:bg-[var(--zp-brand)] peer-focus-visible:ring-[3px] peer-focus-visible:ring-[var(--zp-brand)]/25 peer-disabled:opacity-50 after:absolute after:left-[3px] after:top-[3px] after:h-[21px] after:w-[21px] after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-[22px]" />
    </span>
  );
}

export default Switch;
