export async function sendAlertEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.INSTAGRAM_ALERT_EMAIL?.trim();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({from, to: [to], subject, text}),
  });

  return res.ok;
}
