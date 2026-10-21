# Peoples of Oniri guide

## Content source and scope

The catalog in `src/game/peoples.ts` transcribes the five entries under
**Criação de Personagem → Povos e Sexo** in the
[Delírio RPG Online rulebook](https://docs.google.com/document/d/11SG6cx4DcQinmUwQ__8vMD7MZa9bsdO8xXhbxP9HiFc/edit?tab=t.0).
It uses the document content read on October 20, 2026, preserving the full lore
and power descriptions and removing only exported Markdown escapes.

| People | Power | Energy bonuses |
| --- | --- | --- |
| Aetheri | Vontade de Oniri | +1 Mente, +1 Espírito |
| Shaqyr | Herança Felina | +1 Corpo, +1 Espírito |
| Uklith | Conexão Gemológica | +1 Corpo, +1 Mente |
| Vahr’Uk | Sangue de Troll | +1 Corpo, +1 Espírito |
| Humano | Espírito dos Curiosos | +1 Corpo, +1 Mente |

Stable ASCII ids are used for callbacks; display names retain their spelling and
accents. These ids should remain stable when lore is edited so previously sent
menus continue working. Power descriptions are reference content. This guide
does not implement their combat effects, create characters, assign a people,
choose sex, or display portraits.

## Usage

Open `/povos` or choose Povos de Oniri in the private menu. Select a people to read
its full history, power, and bonuses, then use Voltar aos povos or Menu inicial.
Guide pages, recovery messages, and the return to the main menu do not call the
player service. The menu return has neutral wording and does not report a saved
registration. Account commands continue using the onboarding flow.

Group requests direct players to a private conversation. Unknown or obsolete
guide callbacks are acknowledged and offer `/povos` plus working navigation.
Callbacks without an accessible chat are acknowledged without sending a message.

## Development-bot verification

Use the separate development bot and the environment setup in the README:

1. Before registering, send `/povos`. Verify the list shows the five peoples.
2. Open every detail page and compare the history, power, and Energy bonuses with
   the source document. Check Vahr’Uk's extra reaction cost and the Human's two
   professions as well as the other three powers.
3. Navigate back to the list, open another people, and return to Menu inicial.
   Verify Meu perfil, Ajuda, and Povos de Oniri remain available.
4. Start a fresh function invocation and click a previously sent guide button.
   Confirm navigation still works and the callback loading indicator clears.
5. Verify `/ajuda` includes `/povos`, and `/start` and `/perfil` still work as
   described in the onboarding checklist.
6. In an isolated development environment, use an unavailable database. Verify
   `/povos`, all detail pages, and Menu inicial still work without creating an
   account or saving a selection.
7. Request the guide from a group and verify the private-chat instruction.

The automated suite checks catalog accuracy, all five detail pages, navigation
across new bot instances, invalid payloads, group/inline callbacks, and zero
player-service calls. It also runs the onboarding regression suite. Telegram API
responses are stubbed, so a live development-bot smoke test remains a separate
environment check and is not claimed by those tests.

## Deployment and rollback

This delivery builds on PR #1's onboarding implementation. No dependency changes,
database migrations, or data backfills are required. The webhook retains the
existing server configuration requirements. Validate with the development bot
before promoting a deployment.

Rollback restores the previous application. No registrations or character data
need to be removed. Previously sent guide callbacks will no longer have handlers
under the old application; players can use `/start` to open its supported menu.
