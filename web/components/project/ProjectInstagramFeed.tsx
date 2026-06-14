"use client";

import {useEffect, useState} from "react";
import {FaInstagram} from "react-icons/fa6";
import {useTypoClass} from "@/components/TypographyProvider";
import {
  type GridAspectRatio,
  type GridCropFocus,
  gridAspectRatioBoxStyle,
  gridUsesUniformCrop,
  normalizeGridAspectRatio,
} from "@/lib/gridAspectRatio";
import {gridCropObjectPosition} from "@/lib/sanity/imagePosition";
import type {InstagramFeedPost} from "@/lib/instagram/types";

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, "").trim();
}

function gridClass(columns: number): string {
  const cols = columns >= 2 && columns <= 4 ? columns : 3;
  if (cols === 2) return "grid grid-cols-2 gap-2 md:gap-3";
  if (cols === 4) return "grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3";
  return "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3";
}

export function ProjectInstagramFeed({
  handle,
  maxPosts = 9,
  columns = 3,
  caption,
  gridAspectRatio = "auto",
  cropFocus = "auto",
}: {
  handle: string;
  maxPosts?: number | null;
  columns?: number | null;
  caption?: string | null;
  gridAspectRatio?: GridAspectRatio | null;
  cropFocus?: GridCropFocus | null;
}) {
  const metaClass = useTypoClass("meta");
  const bodyClass = useTypoClass("body");
  const username = normalizeHandle(handle);
  const limit = Math.min(24, Math.max(3, maxPosts ?? 9));

  const [items, setItems] = useState<InstagramFeedPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      username,
      limit: String(limit),
    });

    fetch(`/api/instagram/feed?${params}`)
      .then(async (res) => {
        const data = (await res.json()) as {items?: InstagramFeedPost[]; error?: string};
        if (!res.ok) throw new Error(data.error ?? "Failed to load Instagram feed");
        if (!cancelled) setItems(data.items ?? []);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setItems(null);
          setError(err instanceof Error ? err.message : "Failed to load Instagram feed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, limit]);

  if (!username) return null;

  const aspect = normalizeGridAspectRatio(gridAspectRatio);
  const uniformCrop = gridUsesUniformCrop(aspect);
  const tileBoxStyle = gridAspectRatioBoxStyle(aspect);
  const tileObjectPosition = uniformCrop
    ? gridCropObjectPosition(null, cropFocus ?? "auto")
    : undefined;
  const tileClassName = uniformCrop
    ? "group relative block w-full overflow-hidden rounded-sm bg-zinc-100"
    : "group relative block aspect-square overflow-hidden rounded-sm bg-zinc-100";

  const profileUrl = `https://www.instagram.com/${username}/`;

  return (
    <section className="w-full">
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mb-4 inline-flex items-center gap-2.5 text-base md:text-lg text-zinc-600 transition-colors hover:text-zinc-900 ${bodyClass}`}
      >
        <FaInstagram className="h-5 w-5 shrink-0 md:h-6 md:w-6" aria-hidden />
        <span>@{username}</span>
      </a>

      {loading ? (
        <div className={gridClass(columns ?? 3)} aria-busy="true" aria-label="Loading Instagram feed">
          {Array.from({length: Math.min(limit, 6)}).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-sm bg-zinc-200/80"
              style={tileBoxStyle ?? {aspectRatio: "1 / 1"}}
            />
          ))}
        </div>
      ) : null}

      {error ? (
        <p className={`text-sm text-zinc-500 ${metaClass}`} role="status">
          {error.includes("not configured") ? (
            <>
              Instagram feed is not set up yet. Add{" "}
              <code className="text-xs">INSTAGRAM_ACCESS_TOKEN</code> and{" "}
              <code className="text-xs">INSTAGRAM_USER_ID</code> to{" "}
              <code className="text-xs">web/.env</code>, then restart the dev server.
            </>
          ) : (
            <>Instagram feed could not be loaded. {error}</>
          )}
        </p>
      ) : null}

      {!loading && !error && items && items.length > 0 ? (
        <div className={gridClass(columns ?? 3)}>
          {items.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className={tileClassName}
              style={tileBoxStyle ?? undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- IG CDN URLs are short-lived */}
              <img
                src={post.imageUrl}
                alt={post.caption?.slice(0, 120) || "Instagram post"}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                style={tileObjectPosition ? {objectPosition: tileObjectPosition} : undefined}
                loading="lazy"
                decoding="async"
              />
              {post.mediaType === "VIDEO" ? (
                <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">
                  Video
                </span>
              ) : null}
            </a>
          ))}
        </div>
      ) : null}

      {!loading && !error && items?.length === 0 ? (
        <p className={`text-sm text-zinc-500 ${metaClass}`}>No posts found for @{username}.</p>
      ) : null}

      {caption?.trim() ? (
        <p className={`mt-3 text-sm text-zinc-500 ${metaClass}`}>{caption}</p>
      ) : null}
    </section>
  );
}
