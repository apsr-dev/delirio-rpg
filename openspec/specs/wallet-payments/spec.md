# Wallet And Payments Specification

## Purpose

Defines how players buy and spend in-game coins through an external Pix provider.

## Requirements

### Requirement: Internal Wallet
The system MUST maintain an internal wallet balance for each player.

#### Scenario: Wallet created
- GIVEN a player is registered
- WHEN the player first needs coin balance
- THEN the system creates or retrieves a wallet for that player

### Requirement: Coin Package Purchase
The system MUST create a pending order before sending a Pix payment link.

#### Scenario: Player starts purchase
- GIVEN an active coin package exists
- WHEN a player selects the package in the bot
- THEN the system creates an order with status `pending`
- AND the bot sends a provider payment link or Pix code

### Requirement: Provider Webhook Confirmation
The system MUST credit coins only after a verified payment provider webhook.

#### Scenario: Pix payment confirmed
- GIVEN an order exists with status `pending`
- AND the payment provider sends a valid paid webhook
- WHEN the payment amount matches the expected order amount
- THEN the order is marked `paid`
- AND the player's wallet is credited once
- AND a wallet ledger entry is created

#### Scenario: Duplicate webhook
- GIVEN a paid order was already fulfilled
- WHEN the same provider event is delivered again
- THEN the system records or ignores the duplicate event safely
- AND the player does not receive coins twice

#### Scenario: Untrusted proof
- GIVEN a player sends a screenshot or presses an "I paid" button
- WHEN no verified provider webhook has confirmed payment
- THEN the system does not credit coins

### Requirement: Payment Audit Trail
The system MUST store provider payment events for auditability.

#### Scenario: Provider event received
- GIVEN a payment provider sends a webhook event
- WHEN the event reaches the system
- THEN the raw payload is stored with provider and event identifiers
- AND duplicate provider event identifiers are rejected or ignored
