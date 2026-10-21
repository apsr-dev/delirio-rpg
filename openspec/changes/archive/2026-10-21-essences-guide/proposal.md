# Essences guide

## Why

Players can already consult the peoples of Oniri. They also need to understand
the eight Essences, their elemental affinities, and their Echoes before character
creation.

## What Changes

- Add `/essencias` and an Essências button to the shared initial menu and help.
- Show the eight canonical Essences with descriptions, Sonho/Pesadelo origin,
  primary element, three secondary elements, and named Echo effects.
- Explain the Echo's base gain chance, activation threshold, accumulation limit,
  retention between combats, and use without ending the turn or blocking a Reaction.
- Provide private, stateless list/detail/menu navigation without database access.
- Recover unknown or obsolete guide actions and preserve all existing flows.

## Capabilities

### New Capabilities
- `essences-guide`: canonical catalog, Echo reference rules, and read-only navigation.

### Modified Capabilities
- `telegram-bot`: menu and command help expose the Essences guide.

## Impact

Stacked on the Peoples guide (PR #2). No dependency changes, migrations, saved
Essence choices, point accumulation, or execution of Echo effects are introduced.
The catalog transcribes the supplied Delírio RPG Online rulebook under the
repository's existing proprietary license.

Deploy after the previous increments are available. Rollback restores the
previous application; no data changes or database rollback are required.
