/** Extract a YouTube video ID from common watch, share, embed, and Shorts URLs. */
export function parseYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id && /^[\w-]{11}$/.test(id) ? id : null;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) {
        const id = parts[embedIndex + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }

      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
        const id = parts[shortsIndex + 1];
        return /^[\w-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedSrc(videoId: string): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export type YoutubeVideoAspect = "landscape" | "portrait";

export type YoutubeVideoAspectSetting = "auto" | YoutubeVideoAspect;

/** True for /shorts/ URLs and youtu.be links that resolve as Shorts paths. */
export function isYoutubeShortsUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");
    if (host !== "youtube.com" && host !== "m.youtube.com") return false;
    return parsed.pathname.split("/").filter(Boolean)[0] === "shorts";
  } catch {
    return false;
  }
}

export function resolveYoutubeVideoAspect(
  url: string | null | undefined,
  setting?: YoutubeVideoAspectSetting | null,
): YoutubeVideoAspect {
  if (setting === "portrait") return "portrait";
  if (setting === "landscape") return "landscape";
  return isYoutubeShortsUrl(url) ? "portrait" : "landscape";
}
