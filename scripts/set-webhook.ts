import { requireEnv } from "../src/lib/env.js";

const botToken = requireEnv("BOT_TOKEN");
const baseUrl = requireEnv("PUBLIC_WEBHOOK_BASE_URL").replace(/\/$/, "");
const webhookSecret = requireEnv("TELEGRAM_WEBHOOK_SECRET");
const webhookUrl = `${baseUrl}/api/bot`;
const telegramUrl = new URL(`https://api.telegram.org/bot${botToken}/setWebhook`);

telegramUrl.searchParams.set("url", webhookUrl);
telegramUrl.searchParams.set("secret_token", webhookSecret);
telegramUrl.searchParams.set("allowed_updates", JSON.stringify(["message", "callback_query"]));

const response = await fetch(telegramUrl);
const payload = await response.json();

console.log(JSON.stringify({ webhookUrl, telegram: payload }, null, 2));

if (!response.ok || !payload.ok) {
  process.exitCode = 1;
}
