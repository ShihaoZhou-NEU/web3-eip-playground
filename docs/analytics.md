# Analytics (PostHog)

This document describes the current PostHog tracking setup, event taxonomy,
and where events are emitted in the codebase.

## Setup

Environment variables (local file is ignored by git):

```
apps/eip-playground/.env.local
```

```
VITE_PUBLIC_POSTHOG_KEY=YOUR_PROJECT_API_KEY
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

PostHog is initialized in `apps/eip-playground/client/src/main.tsx` with:

- `autocapture: true`
- `capture_pageview: "history_change"`
- `defaults: "2025-11-30"`

## Event Catalog

### `eip_view`

Triggered when an EIP detail page is viewed.

Properties:
- `eip_id`
- `eip_title`

Source:
- `apps/eip-playground/client/src/pages/EIPDetail.tsx`

### `game_start`

Triggered when a game session begins.

Common properties:
- `eip_id`
- `game_id`

Additional properties (varies by game):
- `mode` (for batching game)
- `reason` (for burner game auto/resume)

Sources:
- `apps/eip-playground/client/src/components/games/eip1559/GasWarGame.tsx`
- `apps/eip-playground/client/src/components/games/eip1559/BurnerGame.tsx`
- `apps/eip-playground/client/src/components/games/eip7702/BatchingGame.tsx`
- `apps/eip-playground/client/src/components/games/eip7702/SponsorshipGame.tsx`
- `apps/eip-playground/client/src/components/games/eip7702/DelegationGame.tsx`
- `apps/eip-playground/client/src/components/games/erc8004/AgentAcademyGame.tsx`

### `game_complete`

Triggered when a game session ends.

Common properties:
- `eip_id`
- `game_id`
- `success` (boolean; for most games)

Additional properties (varies by game):
- `reason` (burner: `pause` or `exit`; batching: `timeout`)
- `mode` (batching)

Sources:
- same as `game_start` sources above

### `wallet_connect`

Triggered on first wallet connection.

Properties:
- `wallet_address`

Source:
- `apps/eip-playground/client/src/App.tsx`

### `nft_mint_start`

Triggered when NFT mint is initiated.

Properties:
- `eip_id`
- `wallet_address`

Source:
- `apps/eip-playground/client/src/lib/nftMint.ts`

### `nft_mint_success`

Triggered when NFT mint succeeds.

Properties:
- `eip_id`
- `wallet_address`
- `token_id`
- `contract_address`
- `tx_hash`

Source:
- `apps/eip-playground/client/src/lib/nftMint.ts`

### `nft_mint_fail`

Triggered when NFT mint fails.

Properties:
- `eip_id`
- `wallet_address`
- `status` (HTTP status when available)
- `error`

Source:
- `apps/eip-playground/client/src/lib/nftMint.ts`

## Notes / Future Considerations

- Wallet address is currently collected as-is. Consider hashing or removing
  before production for privacy compliance.
- Review potential duplication with `@vercel/analytics` if kept.
- If adding new events, use `apps/eip-playground/client/src/lib/analytics.ts`
  for consistency.
