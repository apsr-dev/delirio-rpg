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
