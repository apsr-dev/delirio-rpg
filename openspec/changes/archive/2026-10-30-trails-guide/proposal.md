# Trails guide

## Why

Players can consult peoples, Essences, and Prisms. They also need to understand
the nine Trails, their roles/Energies, and the two initial powers each grants.

## What Changes

- Add `/trilhas`, a Trilhas menu entry, and help documentation.
- Browse Protetor, Ofensivo, or Suporte, then the three Trails in that role.
- Show all nine Trails and 18 initial powers with their types, explicitly stated
  Energy costs, full effects, random alternatives, and limitations.
- Explain the three-Trail limit (one per Energy) and the A/P/R/C legend.
- Offer private, stateless role/list/detail/menu navigation and callback recovery.
- Include canonical content tests, regressions, OpenSpec, and documentation.

## Capabilities

### New Capabilities
- `trails-guide`: canonical initial-Trail catalog and read-only grouped navigation.

### Modified Capabilities
- `telegram-bot`: expose Trilhas in the initial menu and available command help.

## Impact

Stacked on the Prisms guide (PR #4). No dependencies, migrations, saved Trail
choices, advanced-power catalog, or combat-effect execution are introduced.
Rulebook content retains the repository's proprietary license. Missing costs
remain unspecified and missing weapon restrictions are not invented.

Deploy after the previous increments. Rollback restores the previous application
without any account or character data changes.
