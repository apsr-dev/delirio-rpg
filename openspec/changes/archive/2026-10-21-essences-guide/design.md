# Design

A typed catalog in `src/game/essences.ts` contains the eight Essences. Stable ASCII
ids identify callbacks; display names retain accents. Origin is a Sonho/Pesadelo
union and secondary elements are a read-only tuple of three elemental affinities.
Each Echo stores its name and full effect text.

Reference text explains the base 30% chance per Energy expenditure, readiness at
five points, the five-point cap, discarded excess points, retention between
combats until use, and use without ending the turn or preventing a Reaction.
This is descriptive content, not a combat or point-management engine.

The Telegram module follows the existing guide conventions: `/essencias`,
`essences:` callbacks, list/detail pages, recovery navigation, and a neutral
return to the shared initial menu. The main menu keeps the existing callback
payloads and adds Essências beside Povos de Oniri. Help includes the new command.

All guide paths acknowledge callbacks and work without the player service,
registration, or in-memory state. Group access directs users to a private chat;
callbacks without an accessible chat are acknowledged without sending a message.
Unknown ids resolve only through explicit catalog lookup.

Tests dispatch actual grammY updates with Telegram calls stubbed. They verify
canonical content, all eight pages, Echo reference rules, stateless navigation,
groups, invalid/obsolete callbacks, database independence, and the previous
onboarding/Peoples guide behaviors. Hosted Telegram verification remains a
separate development-environment smoke test.
