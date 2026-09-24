import React from "react";
import { avatarGrad, initials } from "@/app/data/designTokens";

export function InitialsAvatar({ name, idx = 0, size = "w-8 h-8" }) {
  return (
    <div className={`${size} rounded-xl flex items-center justify-center text-[10.5px] font-bold text-white flex-shrink-0`}
      style={{ background: avatarGrad(idx) }}>
      {initials(name)}
    </div>
  );
}

export default InitialsAvatar;
