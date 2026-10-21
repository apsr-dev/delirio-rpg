# Telegram Bot Specification

## Purpose

Defines how Delirio RPG receives Telegram updates and responds to players.

## Requirements

### Requirement: Webhook-Based Update Handling
The system MUST receive Telegram updates through a Vercel webhook endpoint and authenticate them before accepting player identity.

#### Scenario: Valid Telegram update
- GIVEN Telegram sends an update to `POST /api/bot`
- AND the request includes the configured Telegram webhook secret
- WHEN the request is processed
- THEN the bot handles the update through grammY
- AND the endpoint returns a successful response to Telegram

#### Scenario: Invalid Telegram secret
- GIVEN a request has a missing or incorrect webhook secret
- WHEN it reaches `POST /api/bot`
- THEN the system rejects it with `401 Unauthorized`
- AND it does not register a player or call the Telegram API

#### Scenario: Missing server secret
- GIVEN the server has no Telegram webhook secret configured
- WHEN the webhook handler is initialized
- THEN initialization fails instead of accepting unauthenticated updates

#### Scenario: Unsupported method
- GIVEN a request uses a method other than POST
- WHEN it reaches `/api/bot`
- THEN the endpoint responds with `405 Method Not Allowed`
- AND advertises POST as the allowed method

### Requirement: Initial Player Registration
The system MUST persist a player account before acknowledging registration on `/start`.

#### Scenario: New user starts the bot
- GIVEN a Telegram user has no account
- WHEN the user sends `/start` in private
- THEN the system saves the account using the Telegram user id
- AND replies with a menu containing Meu perfil, Ajuda, Povos de Oniri, and Essências

#### Scenario: Existing user starts the bot again
- GIVEN an account exists for the Telegram user
- WHEN the user sends `/start` again
- THEN known Telegram profile fields are refreshed
- AND the account id and registration date remain unchanged

### Requirement: Private Account Access
The system MUST offer account commands and menu actions only in private chats.

#### Scenario: Group access
- GIVEN a command or onboarding callback arrives in a group
- WHEN the bot processes it
- THEN it directs the user to a private conversation
- AND does not save or disclose account data

### Requirement: Account Profile
The system MUST support `/perfil` and the Meu perfil button using only the sender's Telegram identity.

#### Scenario: Direct first visit
- GIVEN a user has never sent `/start`
- WHEN the user sends `/perfil` in private
- THEN their account is created
- AND their stored Telegram name, optional username, and registration date are displayed

#### Scenario: Unavailable username
- GIVEN the user has no Telegram username
- WHEN their profile is displayed
- THEN the bot shows that the username is not informed

#### Scenario: Account isolation
- GIVEN two Telegram users have registered
- WHEN one requests a profile with another user's id in command arguments
- THEN only the sender's own profile is displayed

### Requirement: Stateless Initial Menu
The system MUST make profile and help menu buttons usable without in-memory conversation state.

#### Scenario: Button after restart
- GIVEN the menu was sent by a previous function invocation
- WHEN the user clicks Meu perfil
- THEN the callback is acknowledged
- AND their account is loaded from persistent storage

### Requirement: Available Command Help
The system MUST support `/ajuda` and the Ajuda button without database access and advertise only implemented commands.

#### Scenario: Help during database outage
- GIVEN the database is unavailable
- WHEN the user sends `/ajuda` or clicks Ajuda
- THEN the bot lists `/start`, `/perfil`, `/ajuda`, `/povos`, and `/essencias`
- AND does not list removed diagnostic or unfinished commands

### Requirement: Recoverable Registration Failure
The system MUST report persistence failures without claiming the account was saved.

#### Scenario: Failed save
- GIVEN the database rejects or cannot complete a request
- WHEN the user opens the menu or profile
- THEN the bot gives a useful retry instruction
- AND does not show a success message or success menu

#### Scenario: Successful retry
- GIVEN a previous registration attempt failed
- WHEN the user retries after the database recovers
- THEN registration succeeds without creating duplicate accounts
