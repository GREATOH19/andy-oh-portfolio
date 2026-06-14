import {fetchInstagramFeed} from "@/lib/instagram/fetchInstagramFeed";
import {NextResponse} from "next/server";

export const revalidate = 3600;

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const username = searchParams.get("username")?.trim();
  const limitRaw = Number(searchParams.get("limit") ?? "9");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 9;

  if (!username) {
    return NextResponse.json({error: "username is required"}, {status: 400});
  }

  try {
    const items = await fetchInstagramFeed(username, limit);
    return NextResponse.json({items});
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load Instagram feed";
    return NextResponse.json({error: message}, {status: 502});
  }
}
