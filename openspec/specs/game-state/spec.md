# Game State Specification

## Purpose

Defines the persistent RPG state owned by Delirio RPG.

## Requirements

### Requirement: Player Identity
The system MUST identify players by Telegram user id and persist a unique account atomically.

#### Scenario: Player lookup
- GIVEN a private Telegram update includes a user id
- WHEN the bot needs account state
- THEN it finds or creates the player by `telegram_user_id`

#### Scenario: Concurrent first visits
- GIVEN multiple updates arrive for the same unregistered Telegram user
- WHEN they register concurrently
- THEN exactly one account exists for that Telegram user

#### Scenario: Profile refresh
- GIVEN a player changes their Telegram name or removes optional profile fields
- WHEN they open the menu or profile
- THEN saved fields match the current Telegram profile
- AND account identity and registration date are preserved

### Requirement: Character Ownership
The system SHALL associate characters with exactly one player.

#### Scenario: Create character
- GIVEN a registered player
- WHEN the player creates a character
- THEN the character is linked to that player's record
- AND the character can be loaded for later commands

### Requirement: Game State Persistence
The system MUST persist gameplay state in Supabase Postgres.

#### Scenario: Serverless restart
- GIVEN a Vercel Function invocation has ended
- WHEN a later Telegram update arrives for the same player
- THEN the bot can retrieve the player's existing state from Supabase

### Requirement: Rule Engine Boundaries
The system SHALL keep account persistence and RPG rule logic separate from Telegram transport logic.

#### Scenario: Command invokes persistence
- GIVEN a command requires account data
- WHEN the command is processed
- THEN the bot delegates persistence to a player service
- AND Telegram-specific code formats the response

#### Scenario: Command invokes game logic
- GIVEN a Telegram command requires game rules
- WHEN the command is processed
- THEN the bot delegates rule decisions to game modules
- AND Telegram-specific code formats only the interaction response

### Requirement: Server-Only Account Storage
The system MUST restrict player table access to the bot server.

#### Scenario: Public API access
- GIVEN a request uses the anonymous or authenticated database role
- WHEN it attempts to read or write players
- THEN access is denied

#### Scenario: Server access
- GIVEN the bot server uses its service-role client
- WHEN it registers or refreshes a player
- THEN the account can be inserted, updated, and returned with RLS enabled
