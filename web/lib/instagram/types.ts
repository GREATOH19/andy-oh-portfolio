export type InstagramFeedPost = {
  id: string;
  permalink: string;
  imageUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string | null;
  timestamp?: string | null;
};
