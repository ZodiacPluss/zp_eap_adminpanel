import React from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/**
 * Artwork for a resource card or the hero.
 *
 * Renders the real photograph once the item carries an `image`, and falls back
 * to the CSS stand-in named by `art` until then — see the `.zp-res-*` rules in
 * `zp-theme.css`.
 */
export function ResourceArt({ image, art, alt = "", className = "" }) {
  if (image) {
    return <ImageWithFallback src={image} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }
  return <div aria-hidden="true" role="presentation" className={`h-full w-full ${art ?? ""} ${className}`} />;
}

export default ResourceArt;
