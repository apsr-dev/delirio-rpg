## ADDED Requirements

### Requirement: Canonical Prisms Catalog
The system MUST provide all three Prisms from the Delírio RPG Online rulebook with their full descriptions and benefits.

#### Scenario: Complete catalog
- GIVEN the player opens the guide
- WHEN the list is displayed
- THEN Feiticeiro, Ocultista, and Devoto are available

#### Scenario: Complete detail page
- GIVEN the player opens any Prism
- WHEN its detail page is displayed
- THEN it shows the full description, linked Energy, and three named benefits with their full texts
- AND Feiticeiro uses Corpo, Ocultista uses Mente, and Devoto uses Espírito

#### Scenario: Distinct learning and Essence rules
- GIVEN the player consults the three Prisms
- WHEN their benefits are displayed
- THEN Feiticeiro's martial learning references Corpo while Sangue Mágico references DC
- AND Ocultista's learning references Mente
- AND Devoto's point-gain chance is 40%

### Requirement: Prism Reference Rules
The system MUST explain linked Energy and creation-time power/school rules without executing them.

#### Scenario: Linked Energy explanation
- GIVEN the player opens the guide
- WHEN the introduction is displayed
- THEN it explains that linked Energy determines hit chance, damage, and healing for school powers

#### Scenario: School and initial-power notes
- GIVEN a Prism detail page is displayed
- WHEN its reference notes are read
- THEN they explain that a linked school can be changed until its first power is learned
- AND that initial powers may be chosen after character creation

### Requirement: Read-Only Private Prisms Guide
The system MUST support `/prismas` and the Prismas menu button in private chats without registration or database access.

#### Scenario: First visit during database outage
- GIVEN the player is unregistered and the player service is unavailable
- WHEN they send `/prismas`
- THEN the introduction and list are displayed without creating or changing any account, character, or choice

#### Scenario: Group access
- GIVEN a guide command or callback arrives in a group
- WHEN it is processed
- THEN the bot directs the user to a private conversation without displaying the guide

### Requirement: Stateless Prism Navigation
The system MUST provide working paths among the list, details, Essences guide, and main menu across function invocations.

#### Scenario: Older buttons
- GIVEN a Prism button was sent by a previous invocation
- WHEN it is clicked in a new invocation
- THEN it is acknowledged and the requested page is displayed without persistence calls

#### Scenario: Return or consult Essences
- GIVEN the player is reading a Prism detail
- WHEN they choose Voltar aos Prismas, Ver Essências, or Menu inicial
- THEN the respective page is displayed without registering the player or claiming registration success

### Requirement: Prism Callback Recovery
The system MUST acknowledge unknown or obsolete guide callbacks and provide recovery navigation.

#### Scenario: Unknown action or id
- GIVEN a callback in the Prism namespace references an unknown action or catalog id
- WHEN it is processed
- THEN it is acknowledged
- AND the bot offers `/prismas` and working navigation buttons

#### Scenario: No accessible chat
- GIVEN a Prism callback has no accessible chat
- WHEN it is processed
- THEN it is acknowledged without attempting to send a chat message
