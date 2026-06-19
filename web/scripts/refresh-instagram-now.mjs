/**
 * One-shot: refresh Instagram tokens and update web/.env
 * Usage: node scripts/refresh-instagram-now.mjs
 */
import {readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");
const GRAPH = "v21.0";

function loadEnv() {
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function graphGet(path, accessToken) {
  const url = new URL(`https://graph.facebook.com/${GRAPH}/${path}`);
  url.searchParams.set("access_token", accessToken);
  const res = await fetch(url.toString(), {cache: "no-store"});
  const json = await res.json();
  if (!res.ok || json.error?.message) {
    throw new Error(json.error?.message ?? `Graph API error (${res.status})`);
  }
  return json;
}

function updateEnvFile(updates) {
  let text = readFileSync(envPath, "utf8");
  for (const [key, value] of Object.entries(updates)) {
    const re = new RegExp(`^${key}=.*$`, "m");
    if (re.test(text)) {
      text = text.replace(re, `${key}=${value}`);
    } else {
      text += `\n${key}=${value}`;
    }
  }
  writeFileSync(envPath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

loadEnv();

const appId = requireEnv("META_APP_ID");
const appSecret = requireEnv("META_APP_SECRET");
const longLivedUserToken = requireEnv("INSTAGRAM_LONG_LIVED_USER_TOKEN");
const preferredPageId = process.env.INSTAGRAM_PAGE_ID?.trim();
const igUserId = requireEnv("INSTAGRAM_USER_ID");
const oldPageToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

console.log("Testing current INSTAGRAM_ACCESS_TOKEN...");
try {
  await graphGet(`${igUserId}/media?fields=id&limit=1`, oldPageToken);
  console.log("Current page token works. No refresh needed.");
  process.exit(0);
} catch (err) {
  console.log("Current token failed:", err instanceof Error ? err.message : err);
}

console.log("Refreshing long-lived user token...");
const exchangeUrl = new URL(`https://graph.facebook.com/${GRAPH}/oauth/access_token`);
exchangeUrl.searchParams.set("grant_type", "fb_exchange_token");
exchangeUrl.searchParams.set("client_id", appId);
exchangeUrl.searchParams.set("client_secret", appSecret);
exchangeUrl.searchParams.set("fb_exchange_token", longLivedUserToken);

const exchangeRes = await fetch(exchangeUrl.toString(), {cache: "no-store"});
const exchangeJson = await exchangeRes.json();
if (!exchangeRes.ok || !exchangeJson.access_token) {
  throw new Error(
    exchangeJson.error?.message ??
      "Failed to exchange long-lived user token. Re-authorize in Graph API Explorer.",
  );
}

const refreshedUserToken = exchangeJson.access_token;
console.log("User token refreshed.");

console.log("Fetching page access tokens...");
const accounts = await graphGet(
  "me/accounts?fields=id,name,access_token",
  refreshedUserToken,
);
const pages = accounts.data ?? [];
console.log(
  "Pages:",
  pages.map((p) => `${p.name} (${p.id})`).join(", ") || "(none)",
);

const page =
  (preferredPageId ? pages.find((item) => item.id === preferredPageId) : undefined) ??
  pages[0];

const pageAccessToken = page?.access_token?.trim();
const pageId = page?.id?.trim();
if (!pageAccessToken || !pageId) {
  throw new Error("No Facebook Page access token found for this user.");
}

console.log(`Using page: ${page.name} (${pageId})`);

console.log("Verifying new page token against Instagram media...");
await graphGet(`${igUserId}/media?fields=id&limit=1`, pageAccessToken);
console.log("New page token works.");

updateEnvFile({
  INSTAGRAM_LONG_LIVED_USER_TOKEN: refreshedUserToken,
  INSTAGRAM_ACCESS_TOKEN: pageAccessToken,
  INSTAGRAM_PAGE_ID: pageId,
});

console.log("Updated web/.env with fresh tokens.");
