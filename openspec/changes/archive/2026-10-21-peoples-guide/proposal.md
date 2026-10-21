# Peoples of Oniri guide

## Why

Players need to learn the five peoples and their traits before character creation.
The initial menu already provides a reliable entry point, but offers no game
reference content.

## What Changes

- Add a private `/povos` command and a Povos de Oniri entry in the initial menu.
- Show all five peoples, with a detail page for each containing its full lore,
  named power, power description, and Energy bonuses from the rulebook.
- Offer back-to-list and main-menu navigation without database access or
  in-memory conversation state.
- Acknowledge unknown or obsolete guide callbacks and offer a path to reopen it.
- Update command help, specifications, tests, and user documentation together.

## Capabilities

### New Capabilities
- `peoples-guide`: typed catalog, read-only guide, and stateless private navigation.

### Modified Capabilities
- `telegram-bot`: initial menu and command help expose the guide.

## Impact

This change is stacked on player onboarding (PR #1). It adds no database schema,
registration, character creation, saved choices, images, or combat calculations.
Catalog content is sourced from the owner's Delírio RPG Online rulebook and stays
under the repository's proprietary license.

Deploy after the onboarding code is available. Rollback restores the previous
application without any migration or data changes.
