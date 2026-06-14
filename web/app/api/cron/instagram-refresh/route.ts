import {refreshInstagramTokens} from "@/lib/instagram/refreshInstagramToken";
import {sendAlertEmail} from "@/lib/notifications/sendEmail";
import {updateInstagramEnvOnVercel} from "@/lib/vercel/updateProjectEnv";
import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";

function authorizeCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const tokens = await refreshInstagramTokens();
    const deployed = await updateInstagramEnvOnVercel(tokens);

    if (!deployed) {
      await sendAlertEmail({
        subject: "Instagram tokens refreshed — update .env on Vercel",
        text: [
          "Instagram token refresh succeeded.",
          "",
          "Add these to your Vercel environment variables (or local web/.env):",
          "",
          `INSTAGRAM_LONG_LIVED_USER_TOKEN=${tokens.longLivedUserToken}`,
          `INSTAGRAM_ACCESS_TOKEN=${tokens.pageAccessToken}`,
          "",
          "Optional: set VERCEL_ACCESS_TOKEN + VERCEL_PROJECT_ID to auto-update next time.",
        ].join("\n"),
      });
    }

    if (deployed) {
      await sendAlertEmail({
        subject: "Instagram tokens refreshed on Vercel",
        text: [
          "Monthly Instagram token refresh succeeded.",
          "",
          `Page ID: ${tokens.pageId}`,
          "Vercel environment variables were updated automatically.",
        ].join("\n"),
      });
    }

    return NextResponse.json({
      ok: true,
      pageId: tokens.pageId,
      deployedToVercel: deployed,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Instagram token refresh failed";

    await sendAlertEmail({
      subject: "Instagram feed needs your attention",
      text: [
        "Automatic Instagram token refresh failed.",
        "",
        `Error: ${message}`,
        "",
        "What to do:",
        "1. Open Graph API Explorer",
        "2. Generate Access Token (instagram_basic, pages_show_list, pages_read_engagement)",
        "3. Exchange for a long-lived user token",
        "4. Update INSTAGRAM_LONG_LIVED_USER_TOKEN in Vercel / web/.env",
        "5. Run this cron again or update INSTAGRAM_ACCESS_TOKEN manually",
      ].join("\n"),
    });

    return NextResponse.json({ok: false, error: message}, {status: 502});
  }
}
