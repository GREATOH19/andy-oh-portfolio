import type {DetailLine} from "@/lib/types/project";

/** Value-filled lines only — order matches Sanity array order. */
export function projectDetailsForDisplay(
  details: DetailLine[] | null | undefined,
): DetailLine[] {
  return details?.filter((d) => d?.value?.trim()) ?? [];
}
