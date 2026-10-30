## ADDED Requirements

### Requirement: Canonical Initial Trails Catalog
The system MUST provide the nine Trails grouped by role with two complete initial powers each.

#### Scenario: Role and Energy mapping
- GIVEN the player browses roles
- WHEN they open Protetor
- THEN it lists Sentinela (Corpo), Baluarte (Mente), and Magespada (Espírito)
- AND Ofensivo lists Bestial (Corpo), Predador (Mente), and Espiritualista (Espírito)
- AND Suporte lists Sabotador (Corpo), Estrategista (Mente), and Bardo (Espírito)

#### Scenario: Complete power reference
- GIVEN the player opens any Trail
- WHEN its detail page is displayed
- THEN it shows role, Energy, and both named initial powers with their type and full effects
- AND it preserves all random alternatives, durations, percentages, and limitations
- AND it displays an Energy cost only when the rulebook specifies one

### Requirement: Trail Introduction and Legend
The system MUST explain roles, the three-Trail limit, and the power-type legend as reference content.

#### Scenario: Root introduction
- GIVEN the player opens the guide
- WHEN its introduction is displayed
- THEN it explains Protetor, Ofensivo, and Suporte
- AND the character can have up to three Trails, one per Energy
- AND A, P, R, and C identify Ativo, Passivo, Reação, and Concentração

### Requirement: Read-Only Private Trails Guide
The system MUST support `/trilhas` and the Trilhas menu button without requiring registration or database access.

#### Scenario: First visit during database outage
- GIVEN the player is unregistered and persistence is unavailable
- WHEN they browse the guide
- THEN all root, role, detail, and menu pages work without creating or modifying any account, character, or choice

#### Scenario: Group access
- GIVEN a guide command or callback arrives in a group
- WHEN it is processed
- THEN the bot directs the user to a private conversation without displaying guide content

### Requirement: Stateless Grouped Navigation
The system MUST provide paths between roles, Trail lists, details, and the initial menu across function invocations.

#### Scenario: Return to the correct role
- GIVEN a Trail detail page is displayed
- WHEN the player chooses Voltar à função
- THEN the canonical role's three Trails are displayed
- AND the player can return to all roles or the initial menu

#### Scenario: Older buttons
- GIVEN a button was sent by an earlier invocation
- WHEN it is clicked in a new invocation
- THEN it is acknowledged and displays the requested page without in-memory state

### Requirement: Trail Callback Recovery
The system MUST acknowledge unknown or obsolete actions, role ids, and Trail ids and provide recovery navigation.

#### Scenario: Unknown callback
- GIVEN a callback in the Trail namespace references an unsupported action or id
- WHEN it is processed
- THEN it is acknowledged and offers `/trilhas` plus working role/menu buttons

#### Scenario: No accessible chat
- GIVEN a Trail callback has no accessible chat
- WHEN it is processed
- THEN it is acknowledged without attempting to send a chat message
