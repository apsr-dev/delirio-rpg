# Game State Specification

## Purpose

Defines the persistent RPG state owned by Delirio RPG.

## Requirements

### Requirement: Player Identity
The system MUST identify players by Telegram user id.

#### Scenario: Player lookup
- GIVEN a Telegram update includes a user id
- WHEN the bot needs persistent state
- THEN the system finds or creates the player by `telegram_user_id`

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
The system SHOULD keep RPG rule logic separate from Telegram transport logic.

#### Scenario: Command invokes game logic
- GIVEN a Telegram command requires game rules
- WHEN the command is processed
- THEN the bot delegates rule decisions to game modules
- AND Telegram-specific code formats only the interaction response
