# Design

A typed catalog in `src/game/trails.ts` stores three roles and nine Trails.
Each Trail has a stable ASCII id, role id, Energy, and a read-only tuple of two
initial powers. Power types are A (Ativo), P (Passivo), R (Reação), and C
(Concentração). Energy cost is a number only when the source explicitly states
E1 or E(1); null means unspecified, never zero.

Power descriptions preserve all alternatives and limitations, including the
multi-line lists for Predador and Sabotador. Only export formatting is normalized.
No unsupported Trail history, weapon restriction, or missing power cost is
inferred. Role descriptions provide the source's purpose for each grouping.

The Telegram module uses `/trilhas` and `trails:` callbacks. The root introduction
lists roles; each role lists its three Trails with their Energies. Details show
role, Energy, both complete power texts, types, and known costs. Back navigation
derives the correct role from the canonical Trail rather than client-supplied
state. Details also link to all roles and the neutral initial menu.

Every path is private, stateless, and independent of player persistence.
Callbacks are acknowledged; group requests get a private-chat instruction;
callbacks without a chat produce no chat message. Unknown actions, roles, or
Trail ids get recovery navigation. Existing callback ids are unchanged.

Tests verify all nine role/Energy mappings, 18 powers, known/unspecified costs,
multi-line random outcomes, limits, all navigation levels, new bot instances,
invalid callbacks, private access, and zero player-service calls. The previous
regression suite remains included. Live Telegram smoke verification is separate
from automated tests with stubbed Telegram API responses.
