import { requireEnv } from "../src/lib/env.js";

const botToken = requireEnv("BOT_TOKEN");
const telegramUrl = new URL(`https://api.telegram.org/bot${botToken}/deleteWebhook`);

const response = await fetch(telegramUrl);
const payload = await response.json();

console.log(JSON.stringify({ telegram: payload }, null, 2));

if (!response.ok || !payload.ok) {
  process.exitCode = 1;
}
