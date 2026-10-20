# Operations Specification

## Purpose

Defines deployment, environment, and repository operating rules.

## Requirements

### Requirement: Separate Dev And Production Bots
The system MUST use separate Telegram bot tokens for development and production.

#### Scenario: Development bot
- GIVEN a developer is testing locally or in preview
- WHEN Telegram webhooks are configured
- THEN the development environment uses the `Delirio RPG Dev` bot token

#### Scenario: Production bot
- GIVEN production is deployed
- WHEN Telegram webhooks are configured
- THEN production uses the `Delirio RPG` bot token

### Requirement: Single Active Webhook Per Bot
The system MUST NOT share one Telegram bot token across dev and production.

#### Scenario: Shared token avoided
- GIVEN Telegram supports one active webhook per bot token
- WHEN a new environment is configured
- THEN it receives its own bot token
- AND does not replace another environment's webhook

### Requirement: Server-Only Secrets
The system MUST keep bot tokens, webhook secrets, and Supabase service-role keys server-side only.

#### Scenario: Secret configuration
- GIVEN the app is deployed to Vercel
- WHEN environment variables are configured
- THEN secrets are stored as Vercel environment variables
- AND no secret values are committed to Git

### Requirement: Proprietary Public Repository
The repository SHALL remain publicly visible without granting open source reuse rights.

#### Scenario: License review
- GIVEN someone opens the public repository
- WHEN they inspect the license
- THEN the license states all rights are reserved
- AND copying, modification, distribution, hosting, or derivative works require written permission

### Requirement: Bun Test Runner
The system MUST use `bun test` for automated unit tests.

#### Scenario: Unit test execution
- GIVEN project dependencies are installed with Bun
- WHEN a developer runs `bun test`
- THEN all unit tests matching Bun's test file conventions are executed

#### Scenario: New unit tests
- GIVEN a developer adds test coverage
- WHEN the test file is created
- THEN the file uses the `*.test.ts` convention
- AND imports test helpers from `bun:test`

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
