# Design

A typed, read-only catalog in `src/game/peoples.ts` stores the five canonical
peoples. Each has a stable ASCII id, full history, named power/description, and
explicit bonuses for Corpo, Mente, and Espírito. Descriptions explain rules;
the guide does not execute their effects.

The Telegram guide module renders the catalog and registers `/povos` plus the
`peoples:` callback namespace. Payloads contain static actions and catalog ids.
Every callback is acknowledged. Unknown ids or actions show a recovery message
and working navigation; they never select an arbitrary object property.

Guide commands, callbacks, and menu returns work in private chats without calling
the player service. Group access receives a private-chat instruction. Inline
callbacks without a chat are acknowledged without attempting to send a message
to an unavailable chat.

A shared initial-menu renderer keeps start, profile, help, and the guide's menu
return consistent. Returning from the guide renders a neutral menu without
claiming registration succeeded. Entering profile still uses onboarding's
existing persistence path.

Use plain text and inline keyboards. No conversation state, sessions, database,
new dependency, migration, or images are needed. Menus already sent remain valid
across function invocations. Tests dispatch actual grammY updates with the
Telegram API stubbed and assert the player service is never called by the guide.
