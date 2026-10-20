import { describe, expect, test } from "bun:test";
import { IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";
import { createBotWebhook } from "../../src/bot/webhook.js";
import { createTestBot, messageUpdate } from "../helpers/telegram.js";

function request(method: string, secret?: string) {
  const req = new IncomingMessage(new Socket());
  req.method = method;
  if (secret) req.headers["x-telegram-bot-api-secret-token"] = secret;
  req.push(Buffer.from(JSON.stringify(messageUpdate("/ajuda"))));
  req.push(null);
  return req;
}

describe("authenticated bot webhook", () => {
  const players = { ensurePlayer: async () => { throw new Error("Must not access database"); } };

  test("valid POST reaches grammY and completes the response", async () => {
    const { bot, replies } = createTestBot(players);
    const req = request("POST", "test-secret");
    const res = new ServerResponse(req);
    await createBotWebhook(bot, "test-secret")(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.writableEnded).toBe(true);
    expect(replies()[0]?.text).toContain("/perfil");
  });

  test("missing or incorrect secret is rejected before Telegram or database access", async () => {
    for (const secret of [undefined, "wrong-secret"]) {
      const { bot, calls } = createTestBot(players);
      const req = request("POST", secret);
      const res = new ServerResponse(req);
      await createBotWebhook(bot, "test-secret")(req, res);
      expect(res.statusCode).toBe(401);
      expect(res.writableEnded).toBe(true);
      expect(calls).toHaveLength(0);
    }
  });

  test("non-POST requests are rejected", async () => {
    const { bot, calls } = createTestBot(players);
    const req = request("GET", "test-secret");
    const res = new ServerResponse(req);
    await createBotWebhook(bot, "test-secret")(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.getHeader("allow")).toBe("POST");
    expect(calls).toHaveLength(0);
  });

  test("a missing configured secret fails closed", () => {
    const { bot } = createTestBot(players);
    expect(() => createBotWebhook(bot, "")).toThrow("TELEGRAM_WEBHOOK_SECRET");
  });

  test("Telegram delivery failures propagate for webhook retry", async () => {
    const { bot } = createTestBot(players);
    bot.api.config.use(async () => { throw new Error("Telegram unavailable"); });
    const req = request("POST", "test-secret");
    const res = new ServerResponse(req);
    await expect(createBotWebhook(bot, "test-secret")(req, res))
      .rejects.toThrow("Telegram unavailable");
    expect(res.writableEnded).toBe(false);
  });
});
