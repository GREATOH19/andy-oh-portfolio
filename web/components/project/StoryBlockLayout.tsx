import type {ReactNode} from "react";
import {
  projectStoryLayoutClasses,
  type ProjectStoryLayoutOptions,
} from "@/lib/projectStory/layout";

export function StoryBlockLayout({
  layout,
  children,
}: {
  layout?: ProjectStoryLayoutOptions | null;
  children: ReactNode;
}) {
  const {wrapper} = projectStoryLayoutClasses(layout ?? {});
  return <div className={wrapper}>{children}</div>;
}
