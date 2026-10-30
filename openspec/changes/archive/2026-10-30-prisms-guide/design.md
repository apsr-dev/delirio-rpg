# Design

A typed catalog in `src/game/prisms.ts` stores three canonical Prisms. Each has a
stable ASCII id, display name, full description, linked Energy, and a read-only
tuple of three named benefits. Display text preserves the supplied rulebook;
only export formatting is normalized.

Reference text explains the linked Energy's use for school-power hit chance,
damage, and healing. Detail pages also explain the school-switch cutoff at its
first learned power and that initial powers may be chosen after character
creation. No recommendations or saved choices are inferred from player profiles.

The Telegram module follows the existing guide pattern: `/prismas`, `prisms:`
callbacks, list/detail pages, recovery navigation, a neutral main-menu return,
and Ver Essências using the existing `essences:list` callback. All current callback
ids remain unchanged; Prismas is added on a new row in the shared menu.

Every guide action works without registration, the player service, or in-memory
conversation state. Callbacks are acknowledged; group requests receive a private
chat instruction; callbacks without a chat produce no outgoing chat message.
Unknown ids resolve only through catalog lookup.

Tests verify all three descriptions/linked Energies and all nine benefits,
especially Feiticeiro's separate Corpo and DC learning rules, Ocultista's Mente
scaling, and Devoto's 40% chance. Bot tests cover all pages, cross-guide navigation,
new invocations, invalid payloads, private access, and no persistence calls.
Hosted Telegram smoke testing remains a separate development-environment check.
