# Tasks

## Specification
- [x] Update baseline specifications and validate the OpenSpec change.

## Migration
- [x] Generate an additive players migration with the Supabase CLI.
- [x] Verify the full history, unique identity, and restricted database roles.

## Implementation
- [x] Add a typed player service with atomic account persistence.
- [x] Implement private start/profile/help commands and stateless menu buttons.
- [x] Require authenticated webhook requests before accepting Telegram identity.
- [x] Remove diagnostic rolling and unfinished commands.
- [x] Include Bun 1.4.3 and the dependency lockfile.

## Validation and documentation
- [x] Test commands, callbacks, persistence, repeat visits, failures, and webhook access.
- [x] Run Bun tests, TypeScript checks, and OpenSpec validation.
- [x] Document deployment order, development-bot smoke test, and data-preserving rollback.
- [x] Record any hosted environment validation that cannot be performed.
