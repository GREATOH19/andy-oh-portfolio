import type {InstagramFeedPost} from "@/lib/instagram/types";

const GRAPH_VERSION = "v21.0";

type GraphMediaNode = {
  id?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string;
  timestamp?: string;
};

function normalizeHandle(handle: string): string {
  return handle.replace(/^@/, "").trim();
}

function imageUrlForMedia(node: GraphMediaNode): string | null {
  const type = node.media_type ?? "IMAGE";
  if (type === "VIDEO") return node.thumbnail_url ?? node.media_url ?? null;
  return node.media_url ?? node.thumbnail_url ?? null;
}

function mapMediaNode(node: GraphMediaNode): InstagramFeedPost | null {
  const imageUrl = imageUrlForMedia(node);
  const permalink = node.permalink?.trim();
  const id = node.id?.trim();
  if (!imageUrl || !permalink || !id) return null;

  const mediaType =
    node.media_type === "VIDEO" || node.media_type === "CAROUSEL_ALBUM"
      ? node.media_type
      : "IMAGE";

  return {
    id,
    permalink,
    imageUrl,
    mediaType,
    caption: node.caption ?? null,
    timestamp: node.timestamp ?? null,
  };
}

/**
 * Fetches media from your connected Instagram Business/Creator account.
 * Requires INSTAGRAM_ACCESS_TOKEN (page token) + INSTAGRAM_USER_ID.
 */
export async function fetchInstagramFeed(
  handle: string,
  limit: number,
): Promise<InstagramFeedPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const igUserId = process.env.INSTAGRAM_USER_ID?.trim();
  if (!token || !igUserId) {
    throw new Error(
      "Instagram API is not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in web/.env",
    );
  }

  const username = normalizeHandle(handle);
  const safeLimit = Math.min(24, Math.max(1, Math.floor(limit)));
  const fields =
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";
  const url = new URL(
    `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media`,
  );
  url.searchParams.set("fields", fields);
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), {
    next: {revalidate: 3600},
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Instagram API error (${res.status}). Check token, permissions, and that @${username} is connected to your Meta app. ${body.slice(0, 200)}`,
    );
  }

  const json = (await res.json()) as {
    data?: GraphMediaNode[];
    error?: {message?: string};
  };

  if (json.error?.message) {
    throw new Error(json.error.message);
  }

  const nodes = json.data ?? [];
  return nodes.map(mapMediaNode).filter((item): item is InstagramFeedPost => item != null);
}
