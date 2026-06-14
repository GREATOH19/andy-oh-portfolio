type VercelEnvTarget = "production" | "preview" | "development";

function vercelApiBase(projectId: string): string {
  const teamSlug = process.env.VERCEL_TEAM_SLUG?.trim();
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const params = new URLSearchParams();
  if (teamSlug) params.set("slug", teamSlug);
  else if (teamId) params.set("teamId", teamId);
  const query = params.toString();
  return `https://api.vercel.com/v10/projects/${projectId}/env${query ? `?${query}` : ""}`;
}

function resolveProjectId(): string | null {
  return process.env.VERCEL_PROJECT_ID?.trim() ?? null;
}

async function upsertEnvVar(
  projectId: string,
  token: string,
  key: string,
  value: string,
  targets: VercelEnvTarget[],
): Promise<void> {
  const base = vercelApiBase(projectId);
  const url = `${base}${base.includes("?") ? "&" : "?"}upsert=true`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key,
      value,
      type: "encrypted",
      target: targets,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vercel env upsert failed for ${key} (${res.status}): ${body.slice(0, 200)}`);
  }
}

export async function updateInstagramEnvOnVercel(tokens: {
  longLivedUserToken: string;
  pageAccessToken: string;
}): Promise<boolean> {
  const projectId = resolveProjectId();
  const token = process.env.VERCEL_ACCESS_TOKEN?.trim();
  if (!projectId || !token) return false;

  const targets: VercelEnvTarget[] = ["production", "preview"];
  await upsertEnvVar(
    projectId,
    token,
    "INSTAGRAM_LONG_LIVED_USER_TOKEN",
    tokens.longLivedUserToken,
    targets,
  );
  await upsertEnvVar(
    projectId,
    token,
    "INSTAGRAM_ACCESS_TOKEN",
    tokens.pageAccessToken,
    targets,
  );
  return true;
}
