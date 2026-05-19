import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // #region agent log
  fetch("http://127.0.0.1:7874/ingest/30e55b5c-45b0-4b40-95bc-fb3850ef4ee0", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8e6652" },
    body: JSON.stringify(payload),
  }).catch(() => {});
  // #endregion

  return NextResponse.json({ ok: true });
}

