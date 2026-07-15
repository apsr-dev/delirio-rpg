# Telegram Bot Specification

## Purpose

Defines how Delirio RPG receives Telegram updates and responds to players.

## Requirements

### Requirement: Webhook-Based Update Handling
The system MUST receive Telegram updates through a Vercel webhook endpoint.

#### Scenario: Valid Telegram update
- GIVEN Telegram sends an update to `POST /api/bot`
- AND the request includes the configured Telegram webhook secret
- WHEN the request is processed
- THEN the bot handles the update through grammY
- AND the endpoint returns a successful response to Telegram

#### Scenario: Invalid Telegram secret
- GIVEN a request is sent to `POST /api/bot`
- AND a Telegram webhook secret is configured
- WHEN the request secret does not match the configured secret
- THEN the system rejects the request with `401 Unauthorized`

### Requirement: Initial Player Registration
The system MUST upsert a player record when a Telegram user starts the bot.

#### Scenario: New user starts the bot
- GIVEN a Telegram user has no existing player record
- WHEN the user sends `/start`
- THEN the system creates a player record using the Telegram user id
- AND the bot replies with the initial command list

#### Scenario: Existing user starts the bot again
- GIVEN a Telegram user already has a player record
- WHEN the user sends `/start`
- THEN the system updates known Telegram profile fields
- AND it does not create a duplicate player

### Requirement: Dice Rolling
The system MUST support basic dice expressions for early gameplay.

#### Scenario: Default roll
- GIVEN a player sends `/rolar`
- WHEN no dice expression is provided
- THEN the system rolls `1d20`

#### Scenario: Explicit roll
- GIVEN a player sends `/rolar 2d6+3`
- WHEN the command is processed
- THEN the bot replies with the individual roll parts
- AND the reply includes the total

#### Scenario: Invalid expression
- GIVEN a player sends an invalid dice expression
- WHEN the command is processed
- THEN the bot replies with a useful validation message
