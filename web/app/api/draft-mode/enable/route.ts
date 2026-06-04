import {defineEnableDraftMode} from "next-sanity/draft-mode";
import {client} from "@/lib/sanity/client";

const token = process.env.SANITY_API_READ_TOKEN?.trim();

const draftModeHandlers = token
  ? defineEnableDraftMode({
      client: client.withConfig({token}),
    })
  : null;

export async function GET(request: Request) {
  if (draftModeHandlers) {
    return draftModeHandlers.GET(request);
  }

  return new Response(
    [
      "Missing SANITY_API_READ_TOKEN in web/.env.local.",
      "Create a Viewer token at https://sanity.io/manage → API → Tokens,",
      "add it to web/.env.local, then restart: cd web && npm run dev",
    ].join(" "),
    {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}},
  );
}
