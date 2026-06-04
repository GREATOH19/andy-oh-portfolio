"use client";

import {VisualEditing} from "next-sanity/visual-editing";

/** Connects the site to Sanity Presentation (click-to-edit overlays). */
export function VisualEditingBridge() {
  return <VisualEditing />;
}
