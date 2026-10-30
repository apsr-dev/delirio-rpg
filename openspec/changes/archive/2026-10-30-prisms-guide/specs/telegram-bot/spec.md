## MODIFIED Requirements

### Requirement: Initial Player Registration
The system MUST persist a player account before acknowledging registration on `/start`.

#### Scenario: New user starts the bot
- GIVEN a Telegram user has no account
- WHEN the user sends `/start` in private
- THEN the system saves the account using the Telegram user id
- AND replies with a menu containing Meu perfil, Ajuda, Povos de Oniri, Essências, and Prismas

#### Scenario: Existing user starts the bot again
- GIVEN an account exists for the Telegram user
- WHEN the user sends `/start` again
- THEN known Telegram profile fields are refreshed
- AND the account id and registration date remain unchanged

### Requirement: Available Command Help
The system MUST support `/ajuda` and the Ajuda button without database access and advertise only implemented commands.

#### Scenario: Help during database outage
- GIVEN the database is unavailable
- WHEN the user sends `/ajuda` or clicks Ajuda
- THEN the bot lists `/start`, `/perfil`, `/ajuda`, `/povos`, `/essencias`, and `/prismas`
- AND does not list removed diagnostic or unfinished commands
