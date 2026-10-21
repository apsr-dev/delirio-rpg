# peoples-guide Specification

## Purpose
Defines the read-only Telegram guide to the five peoples of Oniri, their canonical lore, powers, and Energy bonuses.

## Requirements

### Requirement: Canonical Peoples Catalog
The system MUST provide a typed catalog containing all five peoples from the Delírio RPG Online rulebook.

#### Scenario: Complete catalog
- GIVEN the player opens the guide
- WHEN the peoples list is displayed
- THEN Aetheri, Shaqyr, Uklith, Vahr’Uk, and Humano are available
- AND each detail page includes its history, named power, power description, and Energy bonuses

#### Scenario: Accurate bonuses
- GIVEN a player opens a detail page
- WHEN Energy bonuses are displayed
- THEN Aetheri grants +1 Mente and +1 Espírito
- AND Shaqyr and Vahr’Uk grant +1 Corpo and +1 Espírito
- AND Uklith and Humano grant +1 Corpo and +1 Mente

### Requirement: Read-Only Private Guide
The system MUST make the guide accessible by `/povos` and the Povos de Oniri menu button in private conversations without database access or persistent choices.

#### Scenario: First visit during database outage
- GIVEN the player has not registered and the player service is unavailable
- WHEN they send `/povos`
- THEN the guide opens
- AND no player service call, account creation, or selection write occurs

#### Scenario: Group access
- GIVEN the guide is requested by command or callback in a group
- WHEN the bot processes the request
- THEN it directs the user to the private conversation
- AND does not display guide pages or create an account

### Requirement: Stateless Guide Navigation
The system MUST offer working paths between the list, every detail page, and the initial menu without in-memory conversation state.

#### Scenario: Browse another people
- GIVEN the player is reading a detail page
- WHEN they choose Voltar aos povos
- THEN the five peoples are listed again
- AND another detail page can be opened

#### Scenario: Return to main menu
- GIVEN the player is in the guide and the database is unavailable
- WHEN they choose Menu inicial
- THEN the main menu is displayed without claiming registration success
- AND no database request occurs

#### Scenario: Menu from a previous invocation
- GIVEN a guide button was sent by an earlier bot invocation
- WHEN the player clicks it after a new invocation starts
- THEN the callback is acknowledged
- AND the requested page is displayed

### Requirement: Guide Callback Recovery
The system MUST acknowledge unknown or obsolete guide actions and offer a path back to the guide.

#### Scenario: Invalid action or missing people
- GIVEN callback data in the guide namespace references an unknown action or people id
- WHEN the bot processes the callback
- THEN it acknowledges the callback
- AND offers `/povos` and usable navigation to reopen the guide

#### Scenario: Callback without a chat
- GIVEN a guide callback has no accessible chat
- WHEN the bot processes it
- THEN it acknowledges the callback without attempting to send a chat message
