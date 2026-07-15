import { requireEnv } from "../src/lib/env.js";

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("allow", "POST");
    response.end("Method Not Allowed");
    return;
  }

  const setupSecret = requireEnv("SETUP_WEBHOOK_SECRET");
  const authorization = request.headers.authorization;

  if (authorization !== `Bearer ${setupSecret}`) {
    response.statusCode = 401;
    response.end("Unauthorized");
    return;
  }

  const botToken = requireEnv("BOT_TOKEN");
  const baseUrl = requireEnv("PUBLIC_WEBHOOK_BASE_URL").replace(/\/$/, "");
  const webhookSecret = requireEnv("TELEGRAM_WEBHOOK_SECRET");
  const webhookUrl = `${baseUrl}/api/bot`;
  const telegramUrl = new URL(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
  );

  telegramUrl.searchParams.set("url", webhookUrl);
  telegramUrl.searchParams.set("secret_token", webhookSecret);
  telegramUrl.searchParams.set("allowed_updates", JSON.stringify(["message", "callback_query"]));

  const telegramResponse = await fetch(telegramUrl);
  const payload = await telegramResponse.json();

  response.statusCode = telegramResponse.ok ? 200 : 502;
  response.setHeader("content-type", "application/json");
  response.end(
    JSON.stringify({
      webhookUrl,
      telegram: payload,
    }),
  );
}
