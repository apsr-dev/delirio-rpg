# Essences guide

## Content source and scope

The catalog in `src/game/essences.ts` transcribes the eight entries under
**Criação de Personagem → Essências** in the
[Delírio RPG Online rulebook](https://docs.google.com/document/d/11SG6cx4DcQinmUwQ__8vMD7MZa9bsdO8xXhbxP9HiFc/edit?tab=t.0).
It uses the content read on October 20, 2026. Full descriptions and Echo effects
are preserved; exported Markdown escapes are removed. The introduction summarizes
the general Essence explanation and **Especial sobre os Ecos** from that section.

| Essence | Origin | Primary element | Secondary elements | Echo |
| --- | --- | --- | --- | --- |
| Êxtase | Sonho | Elétrico | Sonoro, Ar, Fogo | Corrente de Inspiração |
| Melancolia | Pesadelo | Gelo | Água, Sangue, Terra | Comunhão da Dor |
| Serenidade | Sonho | Ar | Água, Terra, Gelo | Aura da Calma |
| Cólera | Pesadelo | Fogo | Elétrico, Sangue, Sonoro | Ira Devastadora |
| Confiança | Sonho | Terra | Sangue, Água, Fogo | Juramento do Protetor |
| Dissimulação | Pesadelo | Sonoro | Gelo, Ar, Elétrico | Sussurro Venenoso |
| Altruísmo | Sonho | Água | Sonoro, Terra, Elétrico | Atitude Heróica |
| Egoísmo | Pesadelo | Sangue | Fogo, Ar, Gelo | Escudo de Carne |

Origin here means the Essence's Sonho/Pesadelo affiliation, not the character's
starting kingdom. The 30% point-gain chance is explicitly presented as the base
rule; modifiers from other character choices are not evaluated by this guide.
Five points make an Echo available, excess points beyond the five-point cap are
lost, and points persist between combats until use. Using an Echo neither ends
the turn nor prevents the character's Reaction.

Stable ASCII ids identify callbacks while display names retain accents. Keep ids
stable during content edits so previously sent menus continue working. All rules
are reference content: this delivery does not save an Essence, accumulate points,
apply effects, calculate combat, or create characters.

## Usage

Open `/essencias` or choose Essências in the private menu. Read the introduction,
open any of the eight detail pages, and use Voltar às Essências or Menu inicial.
The neutral menu return does not register an account or report registration
success. The player can open either guide from this menu, even with the database
unavailable. Account commands keep their existing persistence behavior.

Group requests direct users to a private chat. Unknown or obsolete Essence
callbacks are acknowledged and provide `/essencias` plus list/menu buttons.
Callbacks without an accessible chat are acknowledged without sending a message.

## Development-bot verification

Use the separate development bot and the environment setup in the README:

1. Before registering, send `/essencias`. Verify the general explanation and all
   eight choices, including the accented display names.
2. Open every Essence and compare its full description, origin, four elemental
   affinities, and Echo name/effect with the rulebook.
3. Confirm the introduction describes the base 30% chance, readiness at five
   points, the five-point cap, discarded excess points, retention between combats,
   and use without ending the turn or blocking a Reaction.
4. Return to the list, open another Essence, return to Menu inicial, and switch
   between the Essences and Peoples guides. Verify existing menu entries remain.
5. Start a new function invocation, then click a previously sent guide button.
   Verify navigation works and the callback loading indicator clears.
6. In isolated development, use an unavailable database. Verify the guide and its
   menu return remain usable without registrations or saved choices.
7. Verify group requests receive a private-chat instruction. Confirm `/ajuda`
   lists `/essencias`, and the previous commands still work.

Automated tests check all eight catalog entries and pages, reference Echo rules,
navigation across new instances, invalid payloads, group/inline callbacks, zero
player-service calls, and the full previous regression suite. Telegram API
responses are stubbed; these tests do not claim a live development-bot smoke test.

## Deployment and rollback

This increment builds on PR #2 and requires no new dependencies, migrations, or
data backfills. Existing webhook environment requirements still apply. Validate
with the development bot before promoting a deployment.

Rollback restores the previous application without altering account or character
data. The old application will not handle already sent Essence callbacks; use
`/start` or `/povos` to open its available navigation.
