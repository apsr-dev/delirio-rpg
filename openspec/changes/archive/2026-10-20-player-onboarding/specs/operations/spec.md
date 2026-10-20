## ADDED Requirements

### Requirement: Pinned Bun Toolchain
The project MUST declare Bun 1.4.3 for local runtime and package management and commit its dependency lockfile.

#### Scenario: Reproducible installation
- GIVEN a developer uses Bun 1.4.3
- WHEN they run `bun install --frozen-lockfile`
- THEN dependencies install from the committed lockfile

#### Scenario: Vercel runtime selection
- GIVEN Vercel manages Bun patch versions
- WHEN deployment configuration is read
- THEN it selects the supported `1.4.x` runtime

### Requirement: Onboarding Deployment
The project MUST document migration order, development-bot verification, and a rollback that preserves player registrations.

#### Scenario: Deployment
- GIVEN a compatible development database is available
- WHEN onboarding is deployed
- THEN the players migration is applied before the application
- AND registration and profile retrieval are verified with the development bot

#### Scenario: Rollback
- GIVEN the application must be rolled back
- WHEN the previous deployment is restored
- THEN the players table and its registrations are preserved
