# Player onboarding

## Why

Players need a reliable first visit before character creation. The current bot
ignores registration errors, advertises unfinished commands, and its migration
history ends by dropping the table it writes to.

## What Changes

- Register or refresh the Telegram account atomically on `/start` and `/perfil`.
- Offer a private-chat menu with Meu perfil and Ajuda, available by command too.
- Persist identity and registration date across function invocations.
- Give a retryable response when persistence fails, without reporting success.
- Remove the diagnostic dice command, its module/tests, and unfinished handlers.
- Include Bun 1.4.3 configuration and a committed dependency lockfile.

## Capabilities

### Modified Capabilities
- `telegram-bot`: private onboarding, profile, help, menu callbacks, and removal of dice rolling.
- `game-state`: persistent account identity with server-only database access.
- `operations`: reproducible Bun 1.4.3 setup and onboarding verification.

## Impact

Only the `players` table is restored in a new migration; existing migrations are
not rewritten. Public database roles cannot access account data. Telegram
identity is accepted only behind the webhook secret. The webhook rejects missing
server configuration. No character, economy, or payment data is introduced.

Apply the new migration before deploying the bot. Rollback redeploys the previous
application and preserves `players`; do not run the historical cleanup against a
populated database. No schema rollback or deletion of registrations is required.
