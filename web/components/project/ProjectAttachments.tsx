"use client";

import {HiOutlineDocumentArrowDown} from "react-icons/hi2";
import {useTypoClass} from "@/components/TypographyProvider";
import type {ProjectAttachment} from "@/lib/types/project";

function formatFileSize(bytes?: number | null): string | null {
  if (bytes == null || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProjectAttachments({
  attachments,
  layout = "default",
}: {
  attachments?: ProjectAttachment[] | null;
  layout?: "default" | "full";
}) {
  const metaClass = useTypoClass("meta");
  const bodyClass = useTypoClass("body");

  const items =
    attachments?.filter((item) => item?.url?.trim() && item?.title?.trim()) ?? [];

  if (items.length === 0) return null;

  const widthClass =
    layout === "full" ? "project-overview-narrow" : "mx-auto max-w-5xl";

  return (
    <section
      className={`${widthClass} mt-10 border-t border-zinc-300/60 pt-8`}
      aria-label="Downloads"
    >
      <p className={`text-sm text-zinc-500 ${metaClass}`}>Downloads</p>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item, index) => {
          const sizeLabel = formatFileSize(item.size);
          const meta = [sizeLabel, item.filename?.trim()].filter(Boolean).join(" · ");

          return (
            <li key={`${item.url}-${index}`}>
              <a
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                download={item.filename ?? undefined}
                className={`group flex items-start gap-3 rounded-sm text-zinc-900 transition-colors hover:text-zinc-600 ${bodyClass}`}
              >
                <HiOutlineDocumentArrowDown
                  className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-600"
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="font-medium underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-400">
                    {item.title}
                  </span>
                  {item.description?.trim() ? (
                    <span className={`mt-1 block text-sm leading-snug text-zinc-600 ${bodyClass}`}>
                      {item.description.trim()}
                    </span>
                  ) : null}
                  {meta ? (
                    <span className={`mt-0.5 block text-xs text-zinc-400 ${metaClass}`}>{meta}</span>
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
