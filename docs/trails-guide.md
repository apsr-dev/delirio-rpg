# Trails guide

## Content source and scope

The catalog in `src/game/trails.ts` transcribes **Criação de Personagem → Trilhas**
in the [Delírio RPG Online rulebook](https://docs.google.com/document/d/11SG6cx4DcQinmUwQ__8vMD7MZa9bsdO8xXhbxP9HiFc/edit?tab=t.0).
It uses the same October 20, 2026 snapshot as the previous guides. All 18 initial
power texts are preserved, including random alternatives, percentages, durations,
and limitations. Exported Markdown escapes/spacing are normalized, and list
bullets become plain-text bullets. No advanced powers are included.

| Role | Trail | Energy | Initial powers |
| --- | --- | --- | --- |
| Protetor | Sentinela | Corpo | Muralha Viva; Estilo Intocável |
| Protetor | Baluarte | Mente | Vanguarda; Triunfar sob Pressão |
| Protetor | Magespada | Espírito | Armamento do Éter; Guarda Mágica |
| Ofensivo | Bestial | Corpo | Furor de Batalha; Passo Voraz |
| Ofensivo | Predador | Mente | Engenharia de Caça; Diário de Caça |
| Ofensivo | Espiritualista | Espírito | Vontade Inquebrável; Canalização Instintiva |
| Suporte | Sabotador | Corpo | Distração Calculada; Mestre do Caos |
| Suporte | Estrategista | Mente | Treinador; Contra-Tática |
| Suporte | Bardo | Espírito | Expressão Artística; Público Seleto |

The type legend is A (Ativo), P (Passivo), R (Reação), and C (Concentração).
E1 and E(1) are stored as cost 1. Where the source omits a cost, the catalog uses
null and the card omits the cost line; it never assumes zero. This includes
Mestre do Caos and Contra-Tática. Effects are shown as reference text and are not
interpreted or executed by the bot.

The root explains the limit of three Trails, one per Energy. Role descriptions
use the source's stated purpose. The source requests descriptions and weapon
information but does not provide a separate history or weapon restriction for
each Trail in these entries; the guide does not invent either.

Stable ASCII ids identify roles and Trails. Keep them stable during content
edits so previously sent buttons work. The detail's back button derives its role
from the canonical Trail record. No choice, power, or character is saved.

## Usage

Open `/trilhas` or choose Trilhas in the private menu. Select a role, then a Trail.
Voltar à função returns to that role's three Trails. Todas as funções reopens the
role list, and Menu inicial renders the neutral shared menu. None of these paths
calls the player service or claims registration succeeded. Existing account
commands retain their persistence behavior.

Group requests receive a private-chat instruction. Unknown actions, roles, or
Trail ids are acknowledged with `/trilhas` and working navigation. Callbacks
without an accessible chat are acknowledged without sending a chat message.

## Development-bot verification

Use the separate development bot and the README environment setup:

1. Before registering, send `/trilhas`. Check all three roles, the three-Trail
   limit, and the complete A/P/R/C legend.
2. Open each role. Verify exactly three Trails with the correct Corpo/Mente/
   Espírito mappings, as listed above.
3. Open all nine details and compare both power names, types, costs, and full
   effects against the source. Check Predador's three Engenharia de Caça outcomes
   and four Diário de Caça bonuses, and Sabotador's three Mestre do Caos outcomes.
4. Check that unspecified costs are omitted and never displayed as zero. Review
   the Bardo's concentration ratios/cancellation and the Espiritualista's
   once-per-combat limit without changing their source wording.
5. From each detail, return to its role, then all roles; open another role and
   return to Menu inicial. Verify all previous guide entries remain usable.
6. Start a new function invocation and click previously sent root, role, and
   detail buttons. Check navigation and callback acknowledgement.
7. In isolated development, use an unavailable database. Verify all guide paths
   still work without registration or saved choices. Verify group requests only
   direct users to a private conversation and `/ajuda` includes `/trilhas`.

Automated tests verify all role/Energy mappings, initial power names/types/costs,
alternatives and limitations, complete card rendering, every navigation level,
new instances, invalid payloads, private access, zero player-service calls, and
the previous regression suite. Telegram API responses are stubbed; a live
development-bot smoke test is a separate environment check.

## Deployment and rollback

This increment builds on PR #4 and introduces no new dependencies, migrations,
or data backfills. Existing webhook environment requirements remain. Verify with
the development bot before promoting a deployment.

Rollback restores the previous application without modifying stored data. The
old application cannot handle previously sent Trail callbacks; use `/start` or
one of its previous guide commands to reopen supported navigation.
