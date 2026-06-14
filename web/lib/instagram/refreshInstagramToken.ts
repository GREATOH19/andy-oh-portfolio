const GRAPH_VERSION = "v21.0";

export type InstagramTokenRefreshResult = {
  longLivedUserToken: string;
  pageAccessToken: string;
  pageId: string;
};

type GraphError = {error?: {message?: string; code?: number}};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function graphGet<T>(path: string, accessToken: string): Promise<T> {
  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${path}`);
  url.searchParams.set("access_token", accessToken);
  const res = await fetch(url.toString(), {cache: "no-store"});
  const json = (await res.json()) as T & GraphError;
  if (!res.ok || json.error?.message) {
    throw new Error(json.error?.message ?? `Graph API error (${res.status})`);
  }
  return json;
}

export async function refreshInstagramTokens(): Promise<InstagramTokenRefreshResult> {
  const appId = requireEnv("META_APP_ID");
  const appSecret = requireEnv("META_APP_SECRET");
  const longLivedUserToken = requireEnv("INSTAGRAM_LONG_LIVED_USER_TOKEN");
  const preferredPageId = process.env.INSTAGRAM_PAGE_ID?.trim();

  const exchangeUrl = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`);
  exchangeUrl.searchParams.set("grant_type", "fb_exchange_token");
  exchangeUrl.searchParams.set("client_id", appId);
  exchangeUrl.searchParams.set("client_secret", appSecret);
  exchangeUrl.searchParams.set("fb_exchange_token", longLivedUserToken);

  const exchangeRes = await fetch(exchangeUrl.toString(), {cache: "no-store"});
  const exchangeJson = (await exchangeRes.json()) as {
    access_token?: string;
    error?: {message?: string};
  };
  if (!exchangeRes.ok || !exchangeJson.access_token) {
    throw new Error(
      exchangeJson.error?.message ??
        "Failed to exchange long-lived user token. Re-authorize in Graph API Explorer.",
    );
  }

  const refreshedUserToken = exchangeJson.access_token;

  const accounts = await graphGet<{
    data?: Array<{id?: string; name?: string; access_token?: string}>;
  }>("me/accounts?fields=id,name,access_token", refreshedUserToken);

  const pages = accounts.data ?? [];
  const page =
    (preferredPageId
      ? pages.find((item) => item.id === preferredPageId)
      : undefined) ?? pages[0];

  const pageAccessToken = page?.access_token?.trim();
  const pageId = page?.id?.trim();
  if (!pageAccessToken || !pageId) {
    throw new Error("No Facebook Page access token found for this user.");
  }

  const igUserId = requireEnv("INSTAGRAM_USER_ID");
  await graphGet<{data?: unknown[]}>(
    `${igUserId}/media?fields=id&limit=1`,
    pageAccessToken,
  );

  return {
    longLivedUserToken: refreshedUserToken,
    pageAccessToken,
    pageId,
  };
}
