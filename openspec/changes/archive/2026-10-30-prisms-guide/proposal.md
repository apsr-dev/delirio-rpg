# Prisms guide

## Why

Players can already consult peoples and Essences. They also need to understand
how the three Prisms access powers, which Energy each uses, and the benefits
each provides before creating a character.

## What Changes

- Add `/prismas` and a Prismas button to the initial menu and command help.
- Show Feiticeiro, Ocultista, and Devoto with their full descriptions, linked
  Energy, and all three named benefits from the supplied rulebook.
- Explain linked Energy, school-switch restrictions, and deferred initial-power
  choices as reference content.
- Offer private, stateless list/detail/menu navigation and a link to Essences.
- Recover obsolete or invalid guide callbacks without accessing the database.
- Include canonical content tests, regression checks, OpenSpec, and documentation.

## Capabilities

### New Capabilities
- `prisms-guide`: canonical catalog and read-only navigation for the three Prisms.

### Modified Capabilities
- `telegram-bot`: expose Prismas in the initial menu and command help.

## Impact

Stacked on the Essences guide (PR #3). No dependency changes, migrations,
character choices, school bindings, power learning, or benefit execution are
introduced. Rulebook content retains the repository's proprietary licensing.

Deploy after the previous increments are available. Rollback restores the
previous application without changing account or character data.
