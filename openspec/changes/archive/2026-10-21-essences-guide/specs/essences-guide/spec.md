## ADDED Requirements

### Requirement: Canonical Essences Catalog
The system MUST offer the eight Essences from the Delírio RPG Online rulebook with all descriptive fields.

#### Scenario: Complete guide
- GIVEN the player opens the guide
- WHEN the list is displayed
- THEN Êxtase, Melancolia, Serenidade, Cólera, Confiança, Dissimulação, Altruísmo, and Egoísmo are available

#### Scenario: Complete detail page
- GIVEN the player opens any Essence
- WHEN its detail page is displayed
- THEN it shows the full description, Sonho or Pesadelo origin, primary element, and three secondary elements
- AND it shows the Echo name and full effect description

### Requirement: Echo Reference Rules
The system MUST explain general Echo rules as reference content without executing them.

#### Scenario: General explanation
- GIVEN the player opens the guide
- WHEN the introduction is displayed
- THEN it states the base 30% chance to receive one Essence point when spending Energy
- AND readiness at five points with a five-point cap and discarded excess points
- AND retention between combats until the Echo is used
- AND using the Echo does not end the turn or prevent a Reaction

### Requirement: Read-Only Private Essences Guide
The system MUST support `/essencias` and the Essências menu button in private chats without requiring registration or accessing the database.

#### Scenario: First visit during database outage
- GIVEN the player is not registered and the player service is unavailable
- WHEN they send `/essencias`
- THEN the list and introduction are displayed
- AND no account, character, selection, or Essence points are created or changed

#### Scenario: Group access
- GIVEN a command or Essence callback arrives in a group
- WHEN it is processed
- THEN the bot directs the user to a private chat without displaying the guide

### Requirement: Stateless Essence Navigation
The system MUST provide paths between the list, every detail page, and the initial menu without in-memory state or database access.

#### Scenario: Browse across invocations
- GIVEN a button was sent by a previous function invocation
- WHEN it is clicked in a new invocation
- THEN it is acknowledged and the requested list or detail page is displayed

#### Scenario: Return and switch guides
- GIVEN the player is reading an Essence detail
- WHEN they choose Voltar às Essências or Menu inicial
- THEN the corresponding list or neutral initial menu is displayed without claiming registration succeeded
- AND the player can open either guide from the menu

### Requirement: Essence Callback Recovery
The system MUST acknowledge obsolete or invalid Essence callbacks and offer recovery navigation.

#### Scenario: Unknown action or missing Essence
- GIVEN an Essence callback references an unknown action or id
- WHEN it is processed
- THEN it is acknowledged
- AND the bot offers `/essencias` and working list/menu buttons

#### Scenario: No accessible chat
- GIVEN an Essence callback has no accessible chat
- WHEN it is processed
- THEN it is acknowledged without attempting to send a chat message
