import { createBot } from "../../src/bot/index.js";
import type { PlayerService } from "../../src/players/types.js";
import type { Update, User } from "grammy/types";

export const telegramUser: User = {
  id: 123456,
  is_bot: false,
  first_name: "Ana",
  last_name: "Silva",
  username: "ana",
};

export function messageUpdate(text: string, user = telegramUser, group = false): Update {
  return {
    update_id: 1,
    message: {
      message_id: 1,
      date: 1,
      chat: group
        ? { id: -100123, type: "supergroup", title: "Teste" }
        : { id: user.id, type: "private", first_name: user.first_name },
      from: user,
      text,
      entities: [{ type: "bot_command", offset: 0, length: text.split(" ")[0]!.length }],
    },
  };
}

export function callbackUpdate(data: string, user = telegramUser, group = false): Update {
  const message = messageUpdate("/start", user, group).message!;
  return {
    update_id: 2,
    callback_query: {
      id: "callback-1",
      from: user,
      chat_instance: "test-chat",
      data,
      message,
    },
  };
}

export function createTestBot(players: PlayerService) {
  const bot = createBot({
    token: "123:test-token",
    players,
    botInfo: {
      id: 999,
      is_bot: true,
      first_name: "Delírio RPG Dev",
      username: "delirio_test_bot",
      can_join_groups: true,
      can_read_all_group_messages: false,
      supports_inline_queries: false,
      can_connect_to_business: false,
      has_main_web_app: false,
      has_topics_enabled: false,
      allows_users_to_create_topics: false,
      can_manage_bots: false,
      supports_join_request_queries: false,
    },
  });
  const calls: { method: string; payload: Record<string, unknown> }[] = [];
  bot.api.config.use(async (_previous, method, payload) => {
    calls.push({ method, payload: payload as Record<string, unknown> });
    if (method === "answerCallbackQuery") return { ok: true, result: true } as never;
    if (method !== "sendMessage") throw new Error(`Unexpected Telegram method: ${method}`);
    return {
      ok: true,
      result: {
        message_id: calls.length,
        date: 1,
        chat: { id: Number((payload as { chat_id: number }).chat_id), type: "private" },
        text: (payload as { text: string }).text,
      },
    } as never;
  });
  return {
    bot,
    calls,
    replies: () => calls.filter((call) => call.method === "sendMessage").map((call) => call.payload),
  };
}
