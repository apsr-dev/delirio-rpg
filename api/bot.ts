import { createBot } from "../src/bot/index.js";
import { createBotWebhook } from "../src/bot/webhook.js";
import { requireEnv } from "../src/lib/env.js";
import { supabase } from "../src/lib/supabase.js";
import { createPlayerService } from "../src/players/service.js";

const bot = createBot({
  token: requireEnv("BOT_TOKEN"),
  players: createPlayerService(supabase),
});

export default createBotWebhook(bot, requireEnv("TELEGRAM_WEBHOOK_SECRET"));
