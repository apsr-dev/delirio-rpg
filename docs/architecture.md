# Delirio RPG Architecture

## Runtime

Delirio RPG runs as webhook-first Telegram bot:

```mermaid
sequenceDiagram
  participant User as Telegram user
  participant TG as Telegram
  participant API as Vercel Function
  participant Bot as grammY
  participant DB as Supabase

  User->>TG: Sends command
  TG->>API: POST /api/bot
  API->>Bot: Validated update
  Bot->>DB: Read/write game state
  DB-->>Bot: Result
  Bot-->>TG: Reply
  TG-->>User: Message
```

The bot should not use long polling in production. Telegram calls `POST /api/bot`, and Vercel starts a short-lived function invocation for that update.

## Environments

Use two Telegram bots:

- `Delirio RPG Dev` for local tunnels and preview deployments
- `Delirio RPG` for production

A bot token can only have one active webhook at a time, so dev and prod should never share the same token.

## Payments

Pix payments should use an external provider webhook:

```mermaid
sequenceDiagram
  participant User as Player
  participant Bot as Telegram bot
  participant API as Vercel API
  participant Pay as Pix provider
  participant DB as Supabase

  User->>Bot: Buy coins
  Bot->>API: Create order
  API->>DB: orders.status = pending
  API->>Pay: Create Pix charge
  Pay-->>API: Payment URL / QR code
  API-->>Bot: Payment link
  Bot-->>User: Send Pix link
  User->>Pay: Pay
  Pay->>API: POST /api/payments/webhook
  API->>Pay: Verify event/payment
  API->>DB: Mark paid and credit wallet
  Bot-->>User: Coins confirmed
```

Coins must only be granted after a verified provider webhook. Never trust a screenshot, receipt upload, or "I paid" button as proof of payment.

Wallet crediting must be idempotent: if the same webhook is delivered twice, the player receives the coins once.
