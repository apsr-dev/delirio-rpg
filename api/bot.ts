import { webhookCallback } from "grammy";
import { createBot } from "../src/bot/index.js";

const bot = createBot();
const handleUpdate = webhookCallback(bot, "https");

export default async function handler(request: any, response: any) {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers["x-telegram-bot-api-secret-token"];

  if (configuredSecret && receivedSecret !== configuredSecret) {
    response.statusCode = 401;
    response.end("Unauthorized");
    return;
  }

  return handleUpdate(request, response);
}
