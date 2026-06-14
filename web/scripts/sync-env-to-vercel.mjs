/**
 * Sync Instagram + cron env vars from web/.env to Vercel (production).
 * Usage: node scripts/sync-env-to-vercel.mjs
 */
import {readFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {spawnSync} from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env");

const KEYS = [
  "INSTAGRAM_ACCESS_TOKEN",
  "INSTAGRAM_USER_ID",
  "INSTAGRAM_PAGE_ID",
  "INSTAGRAM_LONG_LIVED_USER_TOKEN",
  "META_APP_ID",
  "META_APP_SECRET",
  "CRON_SECRET",
  "INSTAGRAM_ALERT_EMAIL",
  "RESEND_API_KEY",
  "VERCEL_PROJECT_ID",
  "VERCEL_TEAM_SLUG",
  "VERCEL_ACCESS_TOKEN",
];

function parseEnv(text) {
  const map = new Map();
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    map.set(key, value);
  }
  return map;
}

const env = parseEnv(readFileSync(envPath, "utf8"));

for (const key of KEYS) {
  const value = env.get(key)?.trim();
  if (!value) {
    console.log(`skip ${key} (empty)`);
    continue;
  }

  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, "production", "--value", value, "--yes", "--force"],
    {cwd: root, encoding: "utf8", shell: true},
  );

  if (result.status !== 0) {
    console.error(result.stdout ?? result.stderr);
    process.exit(result.status ?? 1);
  }

  console.log(`synced ${key} (production)`);
}

console.log("Done. Redeploy production for env changes to apply.");
