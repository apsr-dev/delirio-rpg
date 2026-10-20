# Design

The webhook composes grammY with a player service and Supabase repository.
Transport handlers use only the authenticated update's `from` identity. They do
not accept player ids from commands or callback data. Profile and help buttons
carry only a static action, and can be used after a serverless restart.

`INSERT ... ON CONFLICT (telegram_user_id) DO UPDATE`, via Supabase upsert, creates
or refreshes an account in one operation and returns its stored profile. Omit
`id` and `created_at` so repeat requests preserve both. `updated_at` is refreshed
on each save. A unique constraint protects concurrent first visits. Database
requests have a five-second deadline to leave time for a useful error reply
before grammY's ten-second webhook timeout.

RLS is enabled with no public policies. Revoke public/anonymous/authenticated
access and grant only select, insert, and update to `service_role`. The service
key remains server-side. Profile messages are plain text, so Telegram names
cannot inject formatting. Dates use pt-BR and UTC consistently.

The private-chat menu is stateless. Group commands and callbacks receive a
private-chat instruction without saving or exposing a profile. `/ajuda` works
without the database. Database failures show a useful retry instruction; API
delivery errors still propagate so Telegram can retry the webhook.

Tests drive actual grammY updates with a stubbed Telegram API, exercise the real
Supabase client against a controlled Data API adapter, and execute the complete
migration chain in PGlite (embedded PostgreSQL). The embedded adapter is test-only;
it does not replace a smoke test against hosted Supabase and the development bot.
