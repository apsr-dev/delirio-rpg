# Player onboarding operations

## Database and deployment order

The migration `20261020133620_restore_players.sql` restores only `public.players`
after the historical schema cleanup. Do not edit or reapply historical migrations
against a populated database. The complete history is exercised in the test suite.

1. Use a development Supabase project and the separate Delirio RPG Dev bot.
2. Confirm the remote database is active and review its applied migration history.
   The project requires all migrations in version order; review pending migrations
   before applying them, especially the historical destructive cleanup.
3. Apply the new players migration through the normal Supabase migration workflow.
   It enables RLS, revokes public/anonymous/authenticated access, and grants only
   SELECT, INSERT, and UPDATE to `service_role`. There are intentionally no public
   RLS policies: players are accessed by the server only.
4. Verify that `public.players` exists and run the Supabase security advisors.
5. Deploy the application with BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, SUPABASE_URL,
   and SUPABASE_SERVICE_ROLE_KEY configured server-side. A missing webhook secret
   prevents handler initialization; invalid secrets receive HTTP 401 and methods
   other than POST receive HTTP 405.
6. Point the development bot webhook to that deployment using `bun run set-webhook`
   and the environment setup described in the README. Never replace the production
   bot's webhook while validating development.

## Development-bot smoke test

1. Send `/perfil` as a new user without first sending `/start`. Verify the stored
   Telegram name, username (or “não informado”), and registration date.
2. Send `/start` twice. Confirm exactly one row exists for that Telegram user id
   and that its UUID and `created_at` remain unchanged.
3. Click Meu perfil and Ajuda. Verify both callbacks complete and help lists
   `/start`, `/perfil`, `/ajuda`, and `/povos` only. The menu also offers Povos de Oniri.
4. Redeploy or otherwise start a fresh invocation, then click an earlier menu's
   Meu perfil button. Confirm the same stored identity is loaded.
5. Change the development Telegram profile and request `/perfil` again. Verify
   the stored name and optional fields refresh, preserving UUID and creation date.
6. Use a second account. Verify it receives its own profile even if another account
   id is supplied as a command argument. Group commands must only direct users to
   the private chat and must not create accounts or disclose profiles.
7. In the isolated development environment, temporarily configure an invalid
   database credential. Verify `/start` and `/perfil` show a retry instruction,
   while `/ajuda` works. Restore the credential and confirm a retry succeeds.

The automated suite covers these behaviors locally, including simultaneous first
visits and database role restrictions. Its Data API and Telegram boundaries are
controlled test doubles; it does not verify hosted service connectivity.

## Validation environment

During implementation, the connected `delirio-rpg` Supabase project was reported
as inactive and no development bot credentials were available in this checkout.
No remote migration, deployment, or live Telegram smoke test was performed. Run
the above checklist against an active development environment before production.

## Rollback

Redeploy the previous application version and retain `public.players` and its
data. This additive table does not require a destructive schema rollback. Never
rerun `20260716091836_cleanup_initial_game_schema.sql`: it drops registrations.
The previous application advertises unfinished commands, so verify its expected
behavior before choosing it as a rollback target. No character or payment tables
are introduced by this delivery.
