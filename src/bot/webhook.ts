import type { IncomingMessage, ServerResponse } from "node:http";
import { webhookCallback, type Bot } from "grammy";

export function createBotWebhook(bot: Bot, secret: string) {
  if (!secret) throw new Error("Missing required environment variable: TELEGRAM_WEBHOOK_SECRET");
  const handleUpdate = webhookCallback(bot, "https");

  return async (request: IncomingMessage, response: ServerResponse) => {
    if (request.method !== "POST") {
      response.statusCode = 405;
      response.setHeader("allow", "POST");
      response.end("Method Not Allowed");
      return;
    }

    if (request.headers["x-telegram-bot-api-secret-token"] !== secret) {
      response.statusCode = 401;
      response.end("Unauthorized");
      return;
    }

    return handleUpdate(request, response);
  };
}
