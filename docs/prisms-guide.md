# Prisms guide

## Content source and scope

The catalog in `src/game/prisms.ts` transcribes **Criação de Personagem → Prismas**
in the [Delírio RPG Online rulebook](https://docs.google.com/document/d/11SG6cx4DcQinmUwQ__8vMD7MZa9bsdO8xXhbxP9HiFc/edit?tab=t.0).
This increment uses the same October 20, 2026 source snapshot as the previous
guides. Full descriptions and all nine named benefit texts are preserved, with
exported Markdown escapes, duplicate spacing, and a zero-width export character
normalized. The introduction and creation notes summarize the surrounding text.

| Prism | Linked Energy | Named benefits |
| --- | --- | --- |
| Feiticeiro | Corpo | Técnicas Marciais; Sangue Mágico; Conjurador Físico |
| Ocultista | Mente | Revelação Mágica; Conjuração Metódica; Prisma Fortalecido |
| Devoto | Espírito | Devoção Completa; Epifania Divina; Compreender o Prisma |

Review the learning rules independently: Feiticeiro's Técnicas Marciais uses
Corpo (one additional power per two levels, maximum five), while Sangue Mágico
uses DC (one power per two levels). Ocultista starts with two new powers and can
learn one more per Mente level. Devoto's Devoção Completa raises Essence point-gain
chance to 40%; its other benefits reference the Essence's Sonho/Pesadelo origin
and Espírito-based learning. The guide displays the full texts for these rules.

Linked Energy determines school-power hit chance, damage, and healing. The
creation notes explain that a linked school can be changed until its first power
is learned, and initial powers may be chosen after character creation. These
are reference descriptions, not mechanics executed by the guide.

Stable ASCII ids identify callbacks while names retain their spelling. Keep ids
stable during content edits so earlier menus still work. No Prism, school,
power, or character choices are saved; no recommendations are inferred from
player data and no benefits are applied.

## Usage

Open `/prismas` or choose Prismas in the private menu. Open one of the three detail
pages, then choose Voltar aos Prismas, Ver Essências, or Menu inicial. Ver Essências
uses the existing Essence guide callback. The neutral main-menu return does not
claim registration succeeded. Guide navigation never calls the player service;
account commands retain their existing persistence behavior.

Group requests direct users to a private conversation. Unknown or obsolete
Prism callbacks are acknowledged and offer `/prismas` plus working navigation.
Callbacks without an accessible chat are acknowledged without sending messages.

## Development-bot verification

Use the separate development bot and the environment setup in the README:

1. Before registering, send `/prismas`. Verify the linked Energy explanation and
   the three choices: Feiticeiro, Ocultista, and Devoto.
2. Open every Prism and compare its description, linked Energy, and all three
   benefit names/texts with the rulebook. Check the distinct Corpo/DC learning
   rules, Ocultista's Mente scaling, and Devoto's 40% chance.
3. Verify the school-switch cutoff and deferred initial-power notes on each page.
4. Return to the list, open another Prism, choose Ver Essências, and return to the
   initial menu. Confirm all previous menu entries and guide buttons still work.
5. Start a new function invocation and click an earlier Prism button. Verify
   navigation works and the callback loading indicator clears.
6. In isolated development, use an unavailable database. Verify the Prism guide,
   Essence link, and menu return work without registration or saved choices.
7. Verify group requests receive a private-chat instruction. Confirm `/ajuda`
   lists `/prismas`, and the previous commands still work.

Automated tests check all three catalog entries, all nine benefits, reference
notes, every page, cross-guide navigation, new instances, invalid payloads,
group/inline callbacks, and zero player-service calls. They also run the previous
regression suite. Telegram API responses are stubbed; these tests do not claim
live Telegram verification.

## Deployment and rollback

This increment builds on PR #3 and adds no dependencies, migrations, or data
backfills. Existing webhook environment requirements still apply. Validate with
the development bot before promoting a deployment.

Rollback restores the previous application without changing account or character
data. The old application will not handle already sent Prism callbacks; use
`/start`, `/povos`, or `/essencias` to open its supported navigation.
